// (auth)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

const AuthStack = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="termsAgree" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="serviceTerms" />
    </Stack>
  );
};

export default AuthStack;