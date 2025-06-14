// app/_layout.tsx
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";

// Prevenir que se oculte automáticamente el splash nativo
SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Aquí puedes cargar datos, fuentes, permisos, etc.
        await new Promise(resolve => setTimeout(resolve, 100)); // Simula tiempo de carga
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync(); // Oculta el splash nativo
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null; // ❗No renderices nada hasta que la app esté lista
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Redirect href="/(auth)" />
    </>
  );
};

export default RootNavigation;
