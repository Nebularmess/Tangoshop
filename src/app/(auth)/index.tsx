// SplashScreen.tsx
import { COLORS } from "@/src/constants/colors";
import imagePath from "@/src/constants/imagePath";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, ImageBackground, SafeAreaView, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(auth)/load");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground 
      source={imagePath.splash} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Image 
            source={imagePath.logo} 
            style={styles.logoStyle} 
            resizeMode="contain" 
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoStyle: {
    height: moderateScale(150),
    width: moderateScale(150),
  },
});

export default SplashScreen;