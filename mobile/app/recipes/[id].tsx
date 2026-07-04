import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/services/axios";
import { MealAPI, type Meal } from "@/services/meals";
import { useAppSelector } from "@/store/hooks";
import { recipeDetailStyles } from "@/assets/styles/recipe-detail.styles";
import { COLORS } from "@/constants/colour";
import LoadingSpinner from "@/components/LoadingSpinner";

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user?.id || !recipeId) return;

    const load = async () => {
      setLoading(true);
      try {
        const meal = await MealAPI.getMealById(recipeId);
        if (meal) {
          setRecipe(meal);
          try {
            const { data } = await api.get(`/favorites/${user.id}`);
            const saved = data.data.some((fav: { recipeId: number }) => fav.recipeId === parseInt(recipeId));
            setIsSaved(saved);
          } catch {}
        }
      } catch (err) {
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [recipeId, user?.id]);

  const handleToggleSave = async () => {
    if (!user?.id || !recipe || !recipeId) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/favorites/${user.id}/${recipeId}`);
        setIsSaved(false);
      } else {
        await api.post("/favorites", {
          userId: user.id,
          recipeId: parseInt(recipeId),
          title: recipe.title,
          image: recipe.image,
          cookTime: recipe.cookTime,
          servings: String(recipe.servings),
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading recipe details..." />;
  }

  if (!recipe) {
    return (
      <View style={recipeDetailStyles.errorContainer}>
        <View style={recipeDetailStyles.errorContent}>
          <Text style={recipeDetailStyles.errorTitle}>Recipe not found</Text>
          <TouchableOpacity style={recipeDetailStyles.errorButton} onPress={() => router.back()}>
            <Text style={recipeDetailStyles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const youtubeId = recipe.originalData?.strYoutube?.split("v=")[1];

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image source={{ uri: recipe.image }} style={recipeDetailStyles.headerImage} contentFit="cover" />
          </View>
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]} style={recipeDetailStyles.gradientOverlay} />
          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity style={recipeDetailStyles.floatingButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[recipeDetailStyles.floatingButton, isSaving && { backgroundColor: COLORS.textLight }]}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              <Ionicons name={isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"} size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>{recipe.category}</Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>{recipe.area} Cuisine</Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient colors={["#FF6B6B", "#FF8E53"]} style={recipeDetailStyles.statIconContainer}>
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.cookTime}</Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient colors={["#4ECDC4", "#44A08D"]} style={recipeDetailStyles.statIconContainer}>
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.servings}</Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>

          {youtubeId && (
            <View style={recipeDetailStyles.sectionContainer}>
              <View style={recipeDetailStyles.sectionTitleRow}>
                <LinearGradient colors={["#FF0000", "#CC0000"]} style={recipeDetailStyles.sectionIcon}>
                  <Ionicons name="play" size={16} color={COLORS.white} />
                </LinearGradient>
                <Text style={recipeDetailStyles.sectionTitle}>Video Tutorial</Text>
              </View>
              <TouchableOpacity
                style={recipeDetailStyles.videoCard}
                onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${youtubeId}`)}
              >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
                  <Ionicons name="logo-youtube" size={32} color="#FF0000" />
                  <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Watch on YouTube</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient colors={[COLORS.primary, COLORS.primary + "80"]} style={recipeDetailStyles.sectionIcon}>
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>{recipe.ingredients.length}</Text>
              </View>
            </View>
            <View style={recipeDetailStyles.ingredientsGrid}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={recipeDetailStyles.ingredientCard}>
                  <View style={recipeDetailStyles.ingredientNumber}>
                    <Text style={recipeDetailStyles.ingredientNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={recipeDetailStyles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient colors={["#9C27B0", "#673AB7"]} style={recipeDetailStyles.sectionIcon}>
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>{recipe.instructions.length}</Text>
              </View>
            </View>
            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <LinearGradient colors={[COLORS.primary, COLORS.primary + "CC"]} style={recipeDetailStyles.stepIndicator}>
                    <Text style={recipeDetailStyles.stepNumber}>{index + 1}</Text>
                  </LinearGradient>
                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>{instruction}</Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>Step {index + 1}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={recipeDetailStyles.primaryButton} onPress={handleToggleSave} disabled={isSaving}>
            <LinearGradient colors={[COLORS.primary, COLORS.primary + "CC"]} style={recipeDetailStyles.buttonGradient}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={20} color={COLORS.white} />
              <Text style={recipeDetailStyles.buttonText}>
                {isSaved ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
