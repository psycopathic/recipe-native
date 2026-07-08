import { type RegisterInput, type LoginInput } from "./auth.schema.js";
export declare const registerUserService: (body: RegisterInput) => Promise<{
    id: string;
    name: string | null;
    email: string;
}>;
export declare const loginUserService: (body: LoginInput) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map