// (auth)/register.tsx
// (auth)/register.tsx
import FormComponent from '@/src/components/Form';
import CustomPopup from './CustomPopup';
import imagePath from '@/src/constants/imagePath';
import useAxios from '@/src/hooks/useFetch';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

interface PopupState {
  visible: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  onClose?: () => void;
}

const RegisterScreen = () => {
  const { execute, loading } = useAxios();
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

  const handleRegister = async (formData: Record<string, string>) => {
    const { firstName, lastName, email, password, repeatPassword } = formData;
    
    // Validación de campos vacíos
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password || !repeatPassword) {
      showPopup(
        'Campos Requeridos',
        'Todos los campos son obligatorios'
      );
      return;
    }
    
    // Validación de contraseñas
    if (password !== repeatPassword) {
      showPopup(
        'Contraseñas No Coinciden',
        'Las contraseñas no coinciden'
      );
      return;
    }

    if (password.length < 6) {
      showPopup(
        'Contraseña Muy Corta',
        'La contraseña debe tener al menos 6 caracteres'
      );
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showPopup(
        'Email Inválido',
        'Por favor ingresa un email válido'
      );
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
          showPopup(
            'Registro Exitoso',
            '¡Tu cuenta ha sido creada exitosamente! Ahora puedes iniciar sesión.',
            'success',
            () => router.replace('/(auth)/login')
          );
        } else {
          // Manejar respuesta de error del servidor
          const errorMessage = response.message || 
                              response.error || 
                              'Error al crear la cuenta. Por favor intenta de nuevo.';
          showPopup('Error de Registro', errorMessage);
        }
      } else {
        // Si no hay respuesta, verificar si es por éxito silencioso
        showPopup(
          'Registro Exitoso',
          '¡Tu cuenta ha sido creada exitosamente! Ahora puedes iniciar sesión.',
          'success',
          () => router.replace('/(auth)/login')
        );
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      
      // MANEJO DE ERRORES MEJORADO
      let errorTitle = 'Error de Registro';
      let errorMessage = 'Error al crear la cuenta. Por favor intenta de nuevo.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorTitle = 'Datos Inválidos';
            errorMessage = 'Verifica que todos los campos estén correctos.';
            
            // Manejar errores específicos de validación
            if (data) {
              if (typeof data === 'string') {
                errorMessage = data;
              } else if (data.message) {
                errorMessage = data.message;
              } else if (data.error) {
                errorMessage = data.error;
              } else if (data.detail) {
                errorMessage = data.detail;
              } else if (data.errors) {
                // Manejar errores de validación múltiples
                const errors = data.errors;
                if (Array.isArray(errors)) {
                  errorMessage = errors.join('\n');
                } else if (typeof errors === 'object') {
                  errorMessage = Object.values(errors).flat().join('\n');
                }
              }
            }
            break;
            
          case 409:
            errorTitle = 'Email Ya Registrado';
            errorMessage = 'Este email ya está registrado. Intenta con otro email.';
            break;
            
          case 422:
            errorTitle = 'Error de Validación';
            errorMessage = data?.message || 'Este email ya está registrado. Intenta con otro email.';
            break;
            
          case 429:
            errorTitle = 'Demasiados Intentos';
            errorMessage = 'Has intentado registrarte muchas veces. Espera unos minutos antes de volver a intentar.';
            break;
            
          case 500:
          case 502:
          case 503:
            errorTitle = 'Error del Servidor';
            errorMessage = 'Error del servidor. Por favor intenta más tarde.';
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
        errorMessage = 'No pudimos conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        // Otro tipo de error
        errorTitle = 'Error Inesperado';
        errorMessage = error.message || 'Ocurrió un error inesperado.';
      }
      
      showPopup(errorTitle, errorMessage);
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

export default RegisterScreen;