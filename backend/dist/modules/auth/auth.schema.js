import zod from "zod";
export const registerSchema = zod.object({
    body: zod.object({
        email: zod
            .string()
            .email("Invalid email format")
            .max(255, "Email must be at most 255 characters"),
        password: zod
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must be at most 128 characters"),
        name: zod
            .string()
            .min(1, "Name must be at least 1 character")
            .max(100, "Name must be at most 100 characters")
            .trim()
            .optional(),
    }),
});
export const loginSchema = zod.object({
    body: zod.object({
        email: zod.string().email("Invalid email format"),
        password: zod.string().min(1, "Password is required"),
    }),
});
//# sourceMappingURL=auth.schema.js.map