// TermsOfServiceView.tsx
import BottomComponent from "@/src/components/BottomComponent";
import { COLORS } from "@/src/constants/colors";
import imagePath from "@/src/constants/imagePath";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

const TermsOfServiceView = () => {
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
                    <Text style={styles.termsTitle}>Términos de Servicio</Text>
                </View>
                
                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>1. Aceptación de términos</Text>
                        <Text style={styles.contentText}>
                            Al acceder y utilizar TangoShop, aceptas estar vinculado por estos Términos de Servicio. 
                            Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestro servicio.
                        </Text>

                        <Text style={styles.sectionTitle}>2. Descripción del servicio</Text>
                        <Text style={styles.contentText}>
                            TangoShop es una plataforma de comercio electrónico que permite a los usuarios comprar 
                            y vender productos. Nos reservamos el derecho de modificar o discontinuar el servicio 
                            en cualquier momento.
                        </Text>

                        <Text style={styles.sectionTitle}>3. Cuentas de usuario</Text>
                        <Text style={styles.contentText}>
                            Para utilizar ciertos aspectos del servicio, debes crear una cuenta. Eres responsable 
                            de mantener la confidencialidad de tu cuenta y contraseña, y de todas las actividades 
                            que ocurran bajo tu cuenta.
                        </Text>

                        <Text style={styles.sectionTitle}>4. Conducta del usuario</Text>
                        <Text style={styles.contentText}>
                            Te comprometes a utilizar el servicio solo para fines legales y de acuerdo con estos 
                            términos. No puedes:
                            {"\n"}• Violar cualquier ley o regulación aplicable
                            {"\n"}• Interferir con el funcionamiento del servicio
                            {"\n"}• Intentar acceder a cuentas de otros usuarios
                            {"\n"}• Enviar contenido spam o malicioso
                        </Text>

                        <Text style={styles.sectionTitle}>5. Pagos y reembolsos</Text>
                        <Text style={styles.contentText}>
                            Los precios están sujetos a cambios sin previo aviso. Los pagos se procesan de forma 
                            segura a través de nuestros proveedores de pago. Las políticas de reembolso se aplican 
                            según el tipo de producto y las circunstancias específicas.
                        </Text>

                        <Text style={styles.sectionTitle}>6. Limitación de responsabilidad</Text>
                        <Text style={styles.contentText}>
                            TangoShop no será responsable de daños indirectos, incidentales, especiales o 
                            consecuentes que resulten del uso o la imposibilidad de usar el servicio.
                        </Text>

                        <Text style={styles.sectionTitle}>7. Modificaciones</Text>
                        <Text style={styles.contentText}>
                            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                            Los cambios entrarán en vigor inmediatamente después de su publicación.
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <BottomComponent 
                        title="Aceptar y continuar" 
                        onPress={handleAgreeTerms}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.fromText}>From</Text>
                    <Text style={styles.facebookText}>PROGRAMACION3</Text>
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
        fontSize: moderateScale(24),
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
    fromText: {
        fontSize: moderateScale(12),
        color: COLORS.text,
    },
    facebookText: {
        fontSize: moderateScale(15),
        color: COLORS.text,
    },
});

export default TermsOfServiceView;