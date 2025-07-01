// src/app/(index)/(Setings)/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/header';
import useStore from '../../../hooks/useStorage';

type Screen = 'index' | 'Proveedores' | 'Buscador' | 'Favoritos' | 'Configuracion';

interface SettingOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const Index = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Configuracion');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const { clear: clearStorage } = useStore();

  const handleEditarCuenta = () => {
    router.push('/(index)/(Setings)/editarPerfil');
  };

  const handleMiCatalogo = () => {
    router.push('/(index)/(Setings)/editarMiCatalogo');
  };

  const handleAsistencia = () => {
    router.push('/(index)/(Setings)/asistencia');
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
  setIsLoggingOut(true);
  
  try {
    console.log('🚪 Iniciando proceso de logout...');
    
    // Paso 1: Limpiar Zustand Store
    console.log('🧹 Limpiando Zustand store...');
    clearStorage();
    
    // Paso 2: Limpiar AsyncStorage
    console.log('🗑️ Limpiando AsyncStorage...');
    await AsyncStorage.clear();
    
    // Paso 3: Limpiar storage web si aplica
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      console.log('🌐 Limpiando web storage...');
      window.localStorage?.clear();
      window.sessionStorage?.clear();
    }
    
    console.log('✅ Logout completado, redirigiendo...');
    
    // ✅ USAR setTimeout PARA ASEGURAR QUE EL ESTADO SE ACTUALICE
    setTimeout(() => {
      try {
        // Verificar si el router está disponible
        if (router && typeof router.replace === 'function') {
          router.replace('/(auth)/termsAgree');
        } else {
          console.warn('Router no disponible, usando push');
          router.push('/(auth)/termsAgree');
        }
      } catch (navError) {
        console.error('Error en navegación:', navError);
        // Fallback: intentar con push
        try {
          router.push('/(auth)/termsAgree');
        } catch (pushError) {
          console.error('Error en push fallback:', pushError);
        }
      }
    }, 100); // Pequeño delay para permitir que React actualice el estado
    
  } catch (error) {
    console.error('❌ Error durante el logout:', error);
    
    // Estrategia de fallback: intentar limpiar lo que se pueda
    try {
      console.log('🔄 Intentando fallback de logout...');
      clearStorage();
      
      // Limpiar elementos críticos específicos
      const criticalKeys = ['currentUser', 'authToken', 'userSession'];
      for (const key of criticalKeys) {
        try {
          await AsyncStorage.removeItem(key);
        } catch (keyError) {
          console.warn(`Error removiendo ${key}:`, keyError);
        }
      }
      
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          criticalKeys.forEach(key => {
            window.localStorage?.removeItem(key);
          });
          window.sessionStorage?.clear();
        } catch (webError) {
          console.warn('⚠️ Error limpiando web storage:', webError);
        }
      }
      
      // Navegar con delay incluso si hubo errores
      setTimeout(() => {
        try {
          router.replace('/(auth)/termsAgree');
        } catch (navError) {
          console.error('Error en navegación de fallback:', navError);
          // Último recurso
          router.push('/(auth)/termsAgree');
        }
      }, 200);
      
    } catch (fallbackError) {
      console.error('❌ Error en fallback de logout:', fallbackError);
      
      // Último recurso: solo navegar con delay
      setTimeout(() => {
        try {
          router.replace('/(auth)/termsAgree');
        } catch (finalError) {
          console.error('Error final en navegación:', finalError);
          // Si todo falla, al menos forzar la limpieza del estado local
          setIsLoggingOut(false);
        }
      }, 300);
    }
  } finally {
    // Asegurar que el loading se quite después de un tiempo razonable
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 1000);
  }
};
  
  const settingsOptions: SettingOption[] = [
    {
      id: 'editarCuenta',
      title: 'Editar Cuenta',
      icon: <Icon name="user" size={32} color="#FFFFFF" />,
      onPress: handleEditarCuenta,
    },
    {
      id: 'miCatalogo',
      title: 'Mi Catálogo',
      icon: <Icon name="list" size={32} color="#FFFFFF" />,
      onPress: handleMiCatalogo,
    },
    {
      id: 'asistencia',
      title: 'Asistencia',
      icon: <Icon name="help-circle" size={32} color="#FFFFFF" />,
      onPress: handleAsistencia,
    },
  ];

  const SettingItem = ({ option }: { option: SettingOption }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={option.onPress}
      disabled={isLoggingOut}
    >
      <View style={styles.settingItemContent}>
        <View style={styles.iconContainer}>
          {option.icon}
        </View>
        <Text style={styles.settingTitle}>{option.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderScreen = () => {
    return (
      <>
        <Header
          title="Configuración"
          subtitle="Gestiona tu cuenta y preferencias"
        />

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.settingsContainer}>
            <View style={styles.settingsSection}>
              {settingsOptions.map((option) => (
                <SettingItem key={option.id} option={option} />
              ))}
            </View>

            <View style={styles.logoutSection}>
              <TouchableOpacity 
                style={[
                  styles.logoutButton,
                  isLoggingOut && styles.logoutButtonDisabled
                ]} 
                onPress={handleCerrarSesion}
                disabled={isLoggingOut}
              >
                <View style={styles.iconContainer}>
                  <Icon 
                    name={isLoggingOut ? "loader" : "log-out"} 
                    size={32} 
                    color="#FFFFFF" 
                  />
                </View>
                <Text style={styles.logoutText}>
                  {isLoggingOut ? 'Cerrando Sesión...' : 'Cerrar Sesión'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>Versión 1.0.0</Text>
              <Text style={styles.infoSubtext}>© 2025 Tango Shop</Text>
            </View>
          </View>
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A1F44',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A1F44',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#0A1F44',
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#0A1F44',
    padding: 0,
    paddingBottom: 40,
  },
  settingsSection: {
    backgroundColor: '#0A1F44',
    borderRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 82.16,
    backgroundColor: '#0A1F44',
    borderWidth: 1,
    borderColor: '#1A2F55',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2F55',
    marginBottom: 0,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 17,
  },
  settingTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
    flex: 1,
    fontFamily: 'Segoe UI',
  },
  logoutSection: {
    marginBottom: 30,
    paddingHorizontal: 0,
    backgroundColor: '#0A1F44',
  },
  logoutButton: {
    backgroundColor: '#0A1F44',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 82.16,
    paddingHorizontal: 20,
    borderRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#1A2F55',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Segoe UI',
  },
  infoSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#0A1F44',
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
    opacity: 0.7,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.5,
  },
});

export default Index;