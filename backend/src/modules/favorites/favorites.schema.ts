import zod from "zod";

export const addFavoriteSchema = zod.object({
  body: zod.object({
    userId: zod.string().min(1, "userId is required"),
    recipeId: zod.number().int().positive("recipeId must be a positive integer"),
    title: zod.string().min(1, "title is required").max(255),
    image: zod.string().max(500).optional(),
    cookTime: zod.string().max(50).optional(),
    servings: zod.string().max(50).optional(),
  }),
});

export type AddFavoriteInput = zod.infer<typeof addFavoriteSchema>["body"];
