import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {
  console.log("app/_layout.tsx - Renderizando RootLayout");
  return (
      <Stack>
        <Stack.Screen name="(index)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
  );
}


