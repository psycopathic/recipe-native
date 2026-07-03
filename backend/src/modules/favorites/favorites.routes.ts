import { Router } from "express";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "./favorites.controllers.js";

const router = Router();

router.post("/", addFavorite);
router.get("/:userId", getUserFavorites);
router.delete("/:userId/:recipeId", removeFavorite);

export default router;
