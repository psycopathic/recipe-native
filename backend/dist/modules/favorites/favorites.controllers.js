import ApiResponse from "../../utils/ApiReponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import { addFavoriteService, getUserFavoritesService, removeFavoriteService, } from "./favorites.service.js";
const addFavorite = asyncHandler(async (req, res) => {
    const favorite = await addFavoriteService(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, favorite, "Favorite added successfully"));
});
const getUserFavorites = asyncHandler(async (req, res) => {
    const userId = req.params["userId"];
    const favorites = await getUserFavoritesService(userId);
    return res
        .status(200)
        .json(new ApiResponse(200, favorites, "Favorites fetched successfully"));
});
const removeFavorite = asyncHandler(async (req, res) => {
    const userId = req.params["userId"];
    const recipeId = req.params["recipeId"];
    const result = await removeFavoriteService(userId, parseInt(recipeId));
    return res.status(200).json(new ApiResponse(200, result, result.message));
});
export { addFavorite, getUserFavorites, removeFavorite };
//# sourceMappingURL=favorites.controllers.js.map