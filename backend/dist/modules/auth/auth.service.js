import ApiError from "../../utils/ApiError.js";
import { db } from "../../lib/db.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { comparePasswords, hashPassword } from "../../utils/hash.js";
import { createRefreshToken, createAccessToken } from "../../utils/token.js";
export const registerUserService = async (body) => {
    const result = registerSchema.safeParse({ body });
    if (!result.success) {
        throw new ApiError(400, "Invalid request body", result.error.issues);
    }
    const { name, email, password } = result.data.body;
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await db.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
        data: {
            name: name ?? null,
            email: normalizedEmail,
            password: hashedPassword,
        }
    });
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    };
};
export const loginUserService = async (body) => {
    const result = loginSchema.safeParse({ body });
    if (!result.success) {
        throw new ApiError(400, "Invalid request body", result.error.issues);
    }
    const { email, password } = result.data.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await db.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};
//# sourceMappingURL=auth.service.js.map