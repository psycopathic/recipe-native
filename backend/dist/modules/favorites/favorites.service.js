import ApiError from "../../utils/ApiError.js";
import { db } from "../../lib/db.js";
import { addFavoriteSchema } from "./favorites.schema.js";
export const addFavoriteService = async (body) => {
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
export const getUserFavoritesService = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "userId is required");
    }
    const favorites = await db.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return favorites;
};
export const removeFavoriteService = async (userId, recipeId) => {
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
//# sourceMappingURL=favorites.service.js.map