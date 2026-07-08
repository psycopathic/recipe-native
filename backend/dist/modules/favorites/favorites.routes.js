import { Router } from "express";
import { addFavorite, getUserFavorites, removeFavorite, } from "./favorites.controllers.js";
import requireAuth from "../../middleware/requireAuth.js";
const router = Router();
router.post("/", requireAuth, addFavorite);
router.get("/:userId", requireAuth, getUserFavorites);
router.delete("/:userId/:recipeId", requireAuth, removeFavorite);
export default router;
//# sourceMappingURL=favorites.routes.js.map