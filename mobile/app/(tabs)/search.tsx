import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MealAPI, type Meal } from "@/services/meals";
import { useDebounce } from "@/hooks/useDebounce";
import { searchStyles } from "@/assets/styles/search.styles";
import { COLORS } from "@/constants/colour";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    MealAPI.getRandomMeals(12)
      .then(setRecipes)
      .catch((err) => console.error("Error loading initial data:", err))
      .finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    if (initialLoading) return;

    const search = async () => {
      setLoading(true);
      try {
        if (!debouncedQuery.trim()) {
          const meals = await MealAPI.getRandomMeals(12);
          setRecipes(meals);
        } else {
          let results = await MealAPI.searchMealsByName(debouncedQuery);
          if (results.length === 0) {
            results = await MealAPI.filterByIngredient(debouncedQuery);
          }
          setRecipes(results.slice(0, 12));
        }
      } catch (err) {
        console.error("Error searching:", err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery, initialLoading]);

  if (initialLoading) {
    return <LoadingSpinner message="Loading recipes..." />;
  }

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} style={searchStyles.searchIcon} />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search recipes, ingredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={searchStyles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
        </View>

        {loading ? (
          <View style={searchStyles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={searchStyles.emptyState}>
                <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
                <Text style={searchStyles.emptyTitle}>No recipes found</Text>
                <Text style={searchStyles.emptyDescription}>Try adjusting your search or try different keywords</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

export default SearchScreen;
