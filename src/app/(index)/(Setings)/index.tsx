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
      
      console.log('🧹 Limpiando Zustand store...');
      clearStorage();
      
      console.log('🗑️ Limpiando AsyncStorage...');
      await AsyncStorage.clear();
      
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        console.log('🌐 Limpiando web storage...');
        window.localStorage?.clear();
        window.sessionStorage?.clear();
      }
      
      console.log('Logout completado, redirigiendo...');
      
      setTimeout(() => {
        try {
          if (router && typeof router.replace === 'function') {
            router.replace('/(auth)/termsAgree');
          } else {
            console.warn('Router no disponible, usando push');
            router.push('/(auth)/termsAgree');
          }
        } catch (navError) {
          console.error('Error en navegación:', navError);
          try {
            router.push('/(auth)/termsAgree');
          } catch (pushError) {
            console.error('Error en push fallback:', pushError);
          }
        }
      }, 100); 
      
    } catch (error) {
      console.error('Error durante el logout:', error);
      
      try {
        console.log('Intentando fallback de logout...');
        clearStorage();
        
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
            console.warn('Error limpiando web storage:', webError);
          }
        }
        
        setTimeout(() => {
          try {
            router.replace('/(auth)/termsAgree');
          } catch (navError) {
            console.error('Error en navegación de fallback:', navError);
            router.push('/(auth)/termsAgree');
          }
        }, 200);
        
      } catch (fallbackError) {
        console.error('Error en fallback de logout:', fallbackError);
        
        setTimeout(() => {
          try {
            router.replace('/(auth)/termsAgree');
          } catch (finalError) {
            console.error('Error final en navegación:', finalError);
            setIsLoggingOut(false);
          }
        }, 300);
      }
    } finally {
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1000);
    }
  };
    
  const settingsOptions: SettingOption[] = [
    {
      id: 'editarCuenta',
      title: 'Editar Perfil',
      icon: <Icon name="user" size={24} color="#666" />,
      onPress: handleEditarCuenta,
    },
    {
      id: 'miCatalogo',
      title: 'Mi Catálogo',
      icon: <Icon name="list" size={24} color="#666" />,
      onPress: handleMiCatalogo,
    },
    {
      id: 'asistencia',
      title: 'Asistencia',
      icon: <Icon name="help-circle" size={24} color="#666" />,
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
        <Icon name="chevron-right" size={20} color="#999" />
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
                <View style={styles.logoutContent}>
                  <View style={styles.logoutIconContainer}>
                    <Icon 
                      name={isLoggingOut ? "loader" : "log-out"} 
                      size={24} 
                      color="#dc3545" 
                    />
                  </View>
                  <Text style={styles.logoutText}>
                    {isLoggingOut ? 'Cerrando Sesión...' : 'Cerrar Sesión'}
                  </Text>
                </View>
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
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    paddingBottom: 40,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 60,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  logoutSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 60,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 20,
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc3545',
    flex: 1,
  },
  infoSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default Index;