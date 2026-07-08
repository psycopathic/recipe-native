import zod from "zod";
export declare const addFavoriteSchema: zod.ZodObject<{
    body: zod.ZodObject<{
        userId: zod.ZodString;
        recipeId: zod.ZodNumber;
        title: zod.ZodString;
        image: zod.ZodOptional<zod.ZodString>;
        cookTime: zod.ZodOptional<zod.ZodString>;
        servings: zod.ZodOptional<zod.ZodString>;
    }, zod.z.core.$strip>;
}, zod.z.core.$strip>;
export type AddFavoriteInput = zod.infer<typeof addFavoriteSchema>["body"];
//# sourceMappingURL=favorites.schema.d.ts.map