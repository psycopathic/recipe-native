import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { api } from "@/services/axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { favoritesStyles } from "@/assets/styles/favourites.styles";
import { COLORS } from "@/constants/colour";
import LoadingSpinner from "@/components/LoadingSpinner";
import NoFavoritesFound from "@/components/NoFavoritesFound";

interface Favorite {
  id: string;
  recipeId: number;
  title: string;
  image: string | null;
  cookTime: string | null;
  servings: string | null;
}

const FavoritesScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await api.get(`/favorites/${user.id}`);
      setFavorites(data.data);
    } catch (err) {
      console.error("Error loading favorites:", err);
      Alert.alert("Error", "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (loading) {
    return <LoadingSpinner message="Loading your favorites..." />;
  }

  return (
    <View style={favoritesStyles.container}>
      <View style={favoritesStyles.header}>
        <Text style={favoritesStyles.title}>Favorites</Text>
        <TouchableOpacity
          style={favoritesStyles.logoutButton}
          onPress={() =>
            Alert.alert("Logout", "Are you sure you want to logout?", [
              { text: "Cancel", style: "cancel" },
              { text: "Logout", style: "destructive", onPress: () => dispatch(logout()) },
            ])
          }
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border }}>
            {item.image && (
              <Image source={{ uri: item.image }} style={{ width: "100%", height: 140 }} contentFit="cover" />
            )}
            <View style={{ padding: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.text }} numberOfLines={2}>{item.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 }}>
                <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
                <Text style={{ fontSize: 11, color: COLORS.textLight }}>{item.cookTime || "N/A"}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={favoritesStyles.row}
        contentContainerStyle={favoritesStyles.recipesGrid}
        ListEmptyComponent={<NoFavoritesFound />}
      />
    </View>
  );
};

export default FavoritesScreen;
