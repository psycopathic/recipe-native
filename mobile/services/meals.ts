const BASE_URL = process.env.EXPO_PUBLIC_MEALDB_URL;

interface MealRaw {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  [key: string]: string | null;
}

export interface Meal {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  servings: number;
  category: string;
  area: string;
  ingredients: string[];
  instructions: string[];
  originalData: MealRaw;
}

async function fetchMeals(endpoint: string): Promise<MealRaw[]> {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  const data = await response.json();
  return data.meals || [];
}

async function fetchSingle(endpoint: string): Promise<MealRaw | null> {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  const data = await response.json();
  return data.meals ? data.meals[0] : null;
}

function transformMealData(meal: MealRaw | null): Meal | null {
  if (!meal) return null;

  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const measureText = measure && measure.trim() ? `${measure.trim()} ` : "";
      ingredients.push(`${measureText}${ingredient.trim()}`);
    }
  }

  const instructions = meal.strInstructions
    ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
    : [];

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    description: meal.strInstructions
      ? meal.strInstructions.substring(0, 120) + "..."
      : "Delicious meal from TheMealDB",
    image: meal.strMealThumb,
    cookTime: "30 minutes",
    servings: 4,
    category: meal.strCategory || "Main Course",
    area: meal.strArea,
    ingredients,
    instructions,
    originalData: meal,
  };
}

export const MealAPI = {
  searchMealsByName: async (query: string): Promise<Meal[]> => {
    try {
      const meals = await fetchMeals(`search.php?s=${encodeURIComponent(query)}`);
      return meals.map(transformMealData).filter((m): m is Meal => m !== null);
    } catch (error) {
      console.error("Error searching meals by name:", error);
      return [];
    }
  },

  getMealById: async (id: string): Promise<Meal | null> => {
    try {
      const meal = await fetchSingle(`lookup.php?i=${id}`);
      return transformMealData(meal);
    } catch (error) {
      console.error("Error getting meal by id:", error);
      return null;
    }
  },

  getRandomMeal: async (): Promise<Meal | null> => {
    try {
      const meal = await fetchSingle("random.php");
      return transformMealData(meal);
    } catch (error) {
      console.error("Error getting random meal:", error);
      return null;
    }
  },

  getRandomMeals: async (count = 6): Promise<Meal[]> => {
    try {
      const promises = Array(count).fill(null).map(() => MealAPI.getRandomMeal());
      const meals = await Promise.all(promises);
      return meals.filter((m): m is Meal => m !== null);
    } catch (error) {
      console.error("Error getting random meals:", error);
      return [];
    }
  },

  getCategories: async (): Promise<{ idCategory: string; strCategory: string; strCategoryThumb: string; strCategoryDescription: string }[]> => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  },

  filterByIngredient: async (ingredient: string): Promise<Meal[]> => {
    try {
      const meals = await fetchMeals(`filter.php?i=${encodeURIComponent(ingredient)}`);
      return meals.map(transformMealData).filter((m): m is Meal => m !== null);
    } catch (error) {
      console.error("Error filtering by ingredient:", error);
      return [];
    }
  },

  filterByCategory: async (category: string): Promise<Meal[]> => {
    try {
      const meals = await fetchMeals(`filter.php?c=${encodeURIComponent(category)}`);
      return meals.map(transformMealData).filter((m): m is Meal => m !== null);
    } catch (error) {
      console.error("Error filtering by category:", error);
      return [];
    }
  },
};
