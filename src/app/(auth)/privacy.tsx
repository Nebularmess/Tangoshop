// PrivacyPolicyView.tsx
import BottomComponent from "@/src/components/BottomComponent";
import { COLORS } from "@/src/constants/colors";
import imagePath from "@/src/constants/imagePath";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

const PrivacyPolicyView = () => {
    const handleBackPress = () => {
        router.back();
    };

    const handleAgreeTerms = () => {
        router.replace("/(auth)/termsAgree");
    };

    return (
        <ImageBackground 
            source={imagePath.splash} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.headerWithBack}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.termsTitle}>Política de Privacidad</Text>
                </View>
                
                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>1. Información que recopilamos</Text>
                        <Text style={styles.contentText}>
                            Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, 
                            realizas una compra o te comunicas con nosotros. Esta información puede incluir tu nombre, 
                            dirección de correo electrónico, dirección postal, número de teléfono e información de pago.
                        </Text>

                        <Text style={styles.sectionTitle}>2. Cómo utilizamos tu información</Text>
                        <Text style={styles.contentText}>
                            Utilizamos la información que recopilamos para:
                            {"\n"}• Procesar y completar tus pedidos
                            {"\n"}• Comunicarnos contigo sobre tu cuenta y pedidos
                            {"\n"}• Mejorar nuestros productos y servicios
                            {"\n"}• Personalizar tu experiencia
                            {"\n"}• Cumplir con obligaciones legales
                        </Text>

                        <Text style={styles.sectionTitle}>3. Compartir información</Text>
                        <Text style={styles.contentText}>
                            No vendemos, intercambiamos ni transferimos tu información personal a terceros sin tu 
                            consentimiento, excepto cuando sea necesario para completar una transacción o cumplir 
                            con la ley.
                        </Text>

                        <Text style={styles.sectionTitle}>4. Seguridad de datos</Text>
                        <Text style={styles.contentText}>
                            Implementamos medidas de seguridad apropiadas para proteger tu información personal 
                            contra acceso no autorizado, alteración, divulgación o destrucción.
                        </Text>

                        <Text style={styles.sectionTitle}>5. Tus derechos</Text>
                        <Text style={styles.contentText}>
                            Tienes derecho a acceder, actualizar o eliminar tu información personal. También puedes 
                            optar por no recibir comunicaciones de marketing en cualquier momento.
                        </Text>

                        <Text style={styles.sectionTitle}>6. Contacto</Text>
                        <Text style={styles.contentText}>
                            Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos a través 
                            de nuestros canales de atención al cliente.
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <BottomComponent 
                        title="Aceptar y continuar" 
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
    },
    headerWithBack: {
        width: '100%',
        alignItems: "center",
        paddingHorizontal: moderateScale(20),
        marginBottom: moderateScale(20),
    },
    backButton: {
        position: 'absolute',
        left: moderateScale(20),
        top: 0,
        zIndex: 1,
    },
    backButtonText: {
        fontSize: moderateScale(16),
        color: COLORS.backButton,
        fontWeight: "bold",
    },
    termsTitle: {
        fontSize: moderateScale(30),
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: moderateScale(75),
        marginBottom: moderateScale(30),
        textAlign: "center",
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: moderateScale(20),
    },
    contentContainer: {
        paddingBottom: moderateScale(20),
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: moderateScale(20),
        marginBottom: moderateScale(20),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: moderateScale(15),
        marginBottom: moderateScale(10),
    },
    contentText: {
        fontSize: moderateScale(14),
        color: COLORS.text,
        lineHeight: moderateScale(20),
        textAlign: "justify",
        marginBottom: moderateScale(10),
    },
    footer: {
        alignItems: "center",
        justifyContent: "flex-end",
    },
});

export default PrivacyPolicyView;