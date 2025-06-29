// (auth)/termsAgree.tsx
import BottomComponent from "@/src/components/BottomComponent";
import { COLORS } from "@/src/constants/colors";
import imagePath from "@/src/constants/imagePath";
import { router } from "expo-router";
import React from "react";
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

const TermsAgreeView = () => {
    const handleAgreeTerms = () => {
        console.log("Usuario aceptó términos y condiciones");
        router.replace("/(auth)/login"); // Redirige al login en lugar de (index)
    };

    const handlePrivacyPolicyPress = () => {
        router.push("/(auth)/privacy");
    };

    const handleTermsOfServicePress = () => {
        router.push("/(auth)/serviceTerms");
    };

    return (
        <ImageBackground 
            source={imagePath.splash} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.termsBody}>
                    <Text style={styles.termsTitle}>Términos y Condiciones</Text>
                    <View style={styles.termsHeader}>
                        <Image source={imagePath.imageTermsAgree} style={styles.termsImage} resizeMode="contain" />
                    </View>
                    <Text style={styles.descriptionText}>
                        Read our{" "}
                        <TouchableOpacity onPress={handlePrivacyPolicyPress}>
                            <Text style={styles.linkText}>Privacy Policy.</Text>
                        </TouchableOpacity>
                        {" "}Tap "Agree and continue" to accept the{" "}
                        <TouchableOpacity onPress={handleTermsOfServicePress}>
                            <Text style={styles.linkText}>Terms of Service.</Text>
                        </TouchableOpacity>
                    </Text>

                    <BottomComponent 
                        title="Agree and continue" 
                        onPress={handleAgreeTerms}
                    />
                </View>
                <View style={styles.footer} />
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
        overflow: 'hidden', // Esto quita el scroll vertical
    },
    termsHeader: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: moderateScale(0.1),
    },
    termsImage: {
        height: moderateScale(250),
        width: moderateScale(250),
        marginBottom: moderateScale(30),
    },
    termsBody: {
        flex: 2,
        paddingHorizontal: moderateScale(50),
        alignItems: "center",
        gap: moderateScale(30),
    },
    termsTitle: {
        fontSize: moderateScale(30),
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: moderateScale(75),
        marginBottom: moderateScale(30),
        textAlign: "center",
    },
    descriptionText: {
        fontSize: moderateScale(14),
        color: COLORS.text,
        textAlign: "center",
        marginBottom: moderateScale(2),
        lineHeight: moderateScale(20),
    },
    linkText: {
        color: COLORS.linkText,
        textDecorationLine: "underline",
    },
    footer: {
        alignItems: "center",
        justifyContent: "flex-end",
    },
});

export default TermsAgreeView;