// index.tsx
import { COLORS } from "@/src/constants/colors";
import imagePath from "@/src/constants/imagePath";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const SplashLoadingViews = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(true);
            setTimeout(() => {
                setIsLoading(false);
                router.replace("/(auth)/termsAgree");
            }, 1500);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ImageBackground 
            source={imagePath.splash} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header} />
                <View style={styles.body}>
                    <Image source={imagePath.icono} style={styles.logoStyle} resizeMode="contain" />
                    <Text style={styles.whatsAppText}>TangoShop</Text>
                </View>
                <View style={styles.footer}>
                    {!showLoader && (
                        <>
                            <Text style={styles.fromText}>From</Text>
                            <Text style={styles.facebookText}>PROGRAMACION3</Text>
                        </>
                    )}
                    {showLoader && isLoading && (
                        <>
                            <ActivityIndicator size={moderateScale(48)} color={COLORS.loadingIndicator} />
                            <Text style={styles.facebookText}>Loading...</Text>
                        </>
                    )}
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
        flexDirection: "column",
        backgroundColor: COLORS.background,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: moderateScale(70),
    },
    header: {
        alignItems: "center",
        gap: moderateScale(7),
    },
    body: {
        alignItems: "center",
        gap: moderateScale(7),
    },
    footer: {
        alignItems: "center",
        height: verticalScale(70),
        justifyContent: "flex-end",
    },
    logoStyle: {
        height: moderateScale(100),
        width: moderateScale(100),
    },
    whatsAppText: {
        fontSize: moderateScale(30),
        fontWeight: "bold",
        color: COLORS.text,
    },
    fromText: {
        fontSize: moderateScale(12),
        color: COLORS.text,
    },
    facebookText: {
        fontSize: moderateScale(15),
        color: COLORS.text,
    },
});

export default SplashLoadingViews;