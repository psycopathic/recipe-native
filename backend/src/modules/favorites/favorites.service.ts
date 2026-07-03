import ApiError from "../../utils/ApiError.js";
import { db } from "../../lib/db.js";
import { addFavoriteSchema, type AddFavoriteInput } from "./favorites.schema.js";

export const addFavoriteService = async (body: AddFavoriteInput) => {
  const result = addFavoriteSchema.safeParse({ body });
  if (!result.success) {
    throw new ApiError(400, "Invalid request body", result.error.issues);
  }

  const { userId, recipeId, title, image, cookTime, servings } = result.data.body;

  const favorite = await db.favorite.create({
    data: {
      userId,
      recipeId,
      title,
      image: image ?? null,
      cookTime: cookTime ?? null,
      servings: servings ?? null,
    },
  });

  return favorite;
};

export const getUserFavoritesService = async (userId: string) => {
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const favorites = await db.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return favorites;
};

export const removeFavoriteService = async (userId: string, recipeId: number) => {
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const favorite = await db.favorite.findFirst({
    where: { userId, recipeId },
  });

  if (!favorite) {
    throw new ApiError(404, "Favorite not found");
  }

  await db.favorite.delete({
    where: { id: favorite.id },
  });

  return { message: "Favorite removed successfully" };
};
