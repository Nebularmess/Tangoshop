import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="editarPerfil" />
      <Stack.Screen name="asistencia" />
    </Stack>
  );
}