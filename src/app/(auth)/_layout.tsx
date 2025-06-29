// (auth)/_layout.tsx
import { Stack } from "expo-router";

export default function AuthLayout() {

  return (
    <Stack>
      <Stack.Screen name="termsAgree" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
      <Stack.Screen name="serviceTerms" options={{ headerShown: false }} />
    </Stack>
  );
}