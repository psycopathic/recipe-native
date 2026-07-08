import { type AddFavoriteInput } from "./favorites.schema.js";
export declare const addFavoriteService: (body: AddFavoriteInput) => Promise<{
    userId: string;
    id: number;
    createdAt: Date | null;
    recipeId: number;
    title: string;
    image: string | null;
    cookTime: string | null;
    servings: string | null;
}>;
export declare const getUserFavoritesService: (userId: string) => Promise<{
    userId: string;
    id: number;
    createdAt: Date | null;
    recipeId: number;
    title: string;
    image: string | null;
    cookTime: string | null;
    servings: string | null;
}[]>;
export declare const removeFavoriteService: (userId: string, recipeId: number) => Promise<{
    message: string;
}>;
//# sourceMappingURL=favorites.service.d.ts.map