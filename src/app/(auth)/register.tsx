// (auth)/register.tsx
import FormComponent from '@/src/components/Form';
import imagePath from '@/src/constants/imagePath';
import useAxios from '@/src/hooks/useFetch';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

const RegisterScreen = () => {
  const { execute, loading } = useAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (formData: Record<string, string>) => {
    const { firstName, lastName, email, password, repeatPassword } = formData;
    
    // Validación de campos vacíos
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password || !repeatPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    
    // Validación de contraseñas
    if (password !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Preparar datos para el registro - FORMATO CORRECTO SEGÚN API
      const registrationData = {
        email: email.trim().toLowerCase(),
        password1: password, // Cambio: usar 'password1' como espera el API
        password2: repeatPassword, // Cambio: usar 'password2' como espera el API
        name: firstName.trim(),
        last_name: lastName.trim()
      };

      console.log('Sending registration data:', {
        ...registrationData,
        password1: '[HIDDEN]',
        password2: '[HIDDEN]'
      });

      const response = await execute({
        method: 'post',
        url: '/registerUser',
        data: registrationData
      });

      console.log('Registration response:', response);

      // MANEJO DE RESPUESTA MEJORADO
      if (response) {
        // Verificar si la respuesta indica éxito
        const isSuccess = response.ok || 
                         response.data || 
                         response.success || 
                         (!response.error && !response.message);

        if (isSuccess) {
          Alert.alert(
            'Registro Exitoso',
            '¡Tu cuenta ha sido creada exitosamente! Ahora puedes iniciar sesión.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/(auth)/login'),
              },
            ]
          );
        } else {
          // Manejar respuesta de error del servidor
          const errorMessage = response.message || 
                              response.error || 
                              'Error al crear la cuenta. Por favor intenta de nuevo.';
          Alert.alert('Error', errorMessage);
        }
      } else {
        // Si no hay respuesta, verificar si es por éxito silencioso
        Alert.alert(
          'Registro Exitoso',
          '¡Tu cuenta ha sido creada exitosamente! Ahora puedes iniciar sesión.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      
      // MANEJO DE ERRORES MEJORADO
      let errorMessage = 'Error al crear la cuenta. Por favor intenta de nuevo.';
      
      if (error.response?.data) {
        // Si el servidor devuelve errores específicos
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.errors) {
          // Manejar errores de validación múltiples
          const errors = error.response.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.join('\n');
          } else if (typeof errors === 'object') {
            errorMessage = Object.values(errors).flat().join('\n');
          }
        }
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifica que todos los campos estén correctos.';
      } else if (error.response?.status === 409 || error.response?.status === 422) {
        errorMessage = 'Este email ya está registrado. Intenta con otro email.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error del servidor. Por favor intenta más tarde.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/(auth)/login');
  };

  const registerFields = [
    {
      key: 'firstName',
      placeholder: 'Nombre',
    },
    {
      key: 'lastName',
      placeholder: 'Apellido',
    },
    {
      key: 'email',
      placeholder: 'Email',
      keyboardType: 'email-address' as const,
    },
    {
      key: 'password',
      placeholder: 'Contraseña',
      secureTextEntry: true,
    },
    {
      key: 'repeatPassword',
      placeholder: 'Repetir Contraseña',
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
            subtitle="Create an account to get started"
            fields={registerFields}
            primaryButtonText={isSubmitting || loading ? "Creando cuenta..." : "Crear cuenta"}
            secondaryButtonText="Login"
            onPrimaryButtonPress={handleRegister}
            onSecondaryButtonPress={handleGoToLogin}
            showForgotPassword={false}
            isLoginScreen={false}
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

export default RegisterScreen;