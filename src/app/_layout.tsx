import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../../global.css";
import useAuth from "../hooks/useAuth";

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === undefined) return;

    if (isAuthenticated) {
      router.replace("/(index)/(home)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  // Pantalla de carga mientras se verifica autenticación
  if (isAuthenticated === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Este return solo se alcanza momentáneamente hasta que useEffect redirija
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(index)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}


