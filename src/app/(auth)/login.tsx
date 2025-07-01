import FormComponent from '@/src/components/Form';
import imagePath from '@/src/constants/imagePath';
import useAxios from '@/src/hooks/useFetch';
import useStore from '@/src/hooks/useStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import CustomPopup from './CustomPopup';

interface PopupState {
  visible: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  onClose?: () => void;
}

const LoginScreen = () => {
  const { execute, loading } = useAxios();
  const { save: saveToStorage } = useStore(); // Usar hook correctamente
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    title: '',
    message: '',
    type: 'error',
  });

  const showPopup = (
    title: string, 
    message: string, 
    type: 'error' | 'success' | 'warning' | 'info' = 'error',
    onClose?: () => void
  ) => {
    setPopup({
      visible: true,
      title,
      message,
      type,
      onClose,
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, visible: false }));
    if (popup.onClose) {
      popup.onClose();
    }
  };

  const handleLogin = async (formData: Record<string, string>) => {
    const { email, password } = formData;
    
    if (!email || !password) {
      showPopup(
        'Campos Requeridos',
        'Por favor completa todos los campos para continuar'
      );
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showPopup(
        'Email Inválido',
        'Por favor ingresa un formato de email válido'
      );
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
        
        // Guardar token si existe
        if (response.ok.data.token) {
          await AsyncStorage.setItem('authToken', response.ok.data.token);
        }
        
        // Guardar en Storage local (Zustand) - CORREGIDO
        saveToStorage({ 
          currentUser: response.ok.data,
          authToken: response.ok.data.token || null
        });
        
        // FIXED: Use showPopup instead of Alert.alert
        showPopup(
          'Inicio de Sesión Exitoso',
          `¡Bienvenido de vuelta, ${response.ok.data.name}!`,
          'success',
          () => router.replace('/(index)/(home)')
        );
      } else {
        // Si la respuesta no es ok pero no se lanzó error
        showPopup(
          'Credenciales Incorrectas',
          'El email o contraseña que ingresaste no son correctos'
        );
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Manejar diferentes tipos de errores
      let errorTitle = 'Error de Acceso';
      let errorMessage = 'No pudimos iniciar sesión. Verifica tus credenciales.';
      
      // Verificar si hay respuesta del servidor
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorTitle = 'Datos Inválidos';
            errorMessage = data?.message || 'Los datos proporcionados no son válidos';
            break;
          case 401:
            errorTitle = 'Credenciales Incorrectas';
            errorMessage = 'El email o contraseña que ingresaste no son correctos';
            break;
          case 404:
            errorTitle = 'Usuario No Encontrado';
            errorMessage = 'No existe una cuenta registrada con este email';
            break;
          case 422:
            errorTitle = 'Error de Validación';
            errorMessage = data?.message || 'Los datos no cumplen con los requisitos';
            break;
          case 429:
            errorTitle = 'Demasiados Intentos';
            errorMessage = 'Has intentado muchas veces. Espera unos minutos antes de volver a intentar';
            break;
          case 500:
          case 502:
          case 503:
            errorTitle = 'Error del Servidor';
            errorMessage = 'Tenemos problemas técnicos. Intenta nuevamente en unos minutos';
            break;
          default:
            if (data?.message) {
              errorMessage = data.message;
            } else if (data?.error) {
              errorMessage = data.error;
            }
        }
      } else if (error.request) {
        // Error de red o conexión
        errorTitle = 'Error de Conexión';
        errorMessage = 'No pudimos conectar con el servidor. Verifica tu conexión a internet';
      } else {
        // Otro tipo de error
        errorTitle = 'Error Inesperado';
        errorMessage = error.message || 'Ocurrió un error inesperado';
      }
      
      showPopup(errorTitle, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPassword = () => {
    showPopup(
      'Recuperar Contraseña',
      'Se enviará un enlace de recuperación a tu email registrado',
      'info'
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
      placeholder: 'Contraseña',
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
            title="Bienvenido a TangoShop"
            subtitle="Inicia sesión para acceder a tu cuenta"
            fields={loginFields}
            primaryButtonText={isSubmitting || loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            secondaryButtonText="Registrarse"
            onPrimaryButtonPress={handleLogin}
            onSecondaryButtonPress={handleGoToRegister}
            onForgotPassword={handleForgotPassword}
            showForgotPassword={true}
            isLoginScreen={true}
          />
        </SafeAreaView>
      </ImageBackground>

      {/* Custom Popup */}
      <CustomPopup
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={closePopup}
      />
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