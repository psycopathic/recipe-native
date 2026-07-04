import { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initializeAuth } from "@/store/authSlice";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={["top", "left", "right"]}>
        <Provider store={store}>
          <AuthBootstrap>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </AuthBootstrap>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
