// (auth)/login.tsx
import FormComponent from '@/src/components/Form';
import imagePath from '@/src/constants/imagePath';
import useAxios from '@/src/hooks/useFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

const LoginScreen = () => {
  const { execute, loading } = useAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (formData: Record<string, string>) => {
    const { email, password } = formData;
    
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await execute({
        method: 'post',
        url: '/loginUser',
        data: {
          email: email,
          password: password
        }
      });

      if (response && response.ok) {
        // Guardar datos del usuario en AsyncStorage
        await AsyncStorage.setItem('currentUser', JSON.stringify(response.ok.data));
        
        Alert.alert(
          'Login Exitoso',
          `¡Bienvenido de vuelta, ${response.ok.data.name}!`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(index)/(home)'),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al iniciar sesión. Verifica tu email y contraseña.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Contraseña',
      'Se enviará un enlace de recuperación a tu email',
      [{ text: 'OK' }]
    );
  };

  const loginFields = [
    {
      key: 'email',
      placeholder: 'Email',
      keyboardType: 'email-address' as const,
    },
    {
      key: 'password',
      placeholder: 'Password',
      secureTextEntry: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagePath.splash}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <FormComponent
            title="Welcome"
            subtitle="Sign in to access your account"
            fields={loginFields}
            primaryButtonText={isSubmitting || loading ? "Iniciando sesión..." : "Sign in"}
            secondaryButtonText="Register"
            onPrimaryButtonPress={handleLogin}
            onSecondaryButtonPress={handleGoToRegister}
            onForgotPassword={handleForgotPassword}
            showForgotPassword={true}
            isLoginScreen={true}
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
});

export default LoginScreen;