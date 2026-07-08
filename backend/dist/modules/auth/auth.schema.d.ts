import zod from "zod";
export declare const registerSchema: zod.ZodObject<{
    body: zod.ZodObject<{
        email: zod.ZodString;
        password: zod.ZodString;
        name: zod.ZodOptional<zod.ZodString>;
    }, zod.z.core.$strip>;
}, zod.z.core.$strip>;
export declare const loginSchema: zod.ZodObject<{
    body: zod.ZodObject<{
        email: zod.ZodString;
        password: zod.ZodString;
    }, zod.z.core.$strip>;
}, zod.z.core.$strip>;
export type RegisterInput = zod.infer<typeof registerSchema>["body"];
export type LoginInput = zod.infer<typeof loginSchema>["body"];
//# sourceMappingURL=auth.schema.d.ts.map