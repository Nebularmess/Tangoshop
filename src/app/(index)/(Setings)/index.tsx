import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/header';
import NavBar from '../../../components/navBar';

type Screen = 'index' | 'Proveedores' | 'Buscador' | 'Favoritos' | 'Configuracion';

interface SettingOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const Index = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Configuracion');

  const handleEditarCuenta = () => {
    router.push('/editarPerfil');
  };

  const handleMiCatalogo = () => {
    Alert.alert('Mi Catálogo', 'Función para gestionar el catálogo personal');
  };

  const handleNotificaciones = () => {
    Alert.alert('Notificaciones', 'Función para configurar notificaciones');
  };

  const handleAsistencia = () => {
    router.push('/asistencia');
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
          onPress: () => {
            console.log('Cerrando sesión...');
          },
        },
      ]
    );
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
      id: 'notificaciones',
      title: 'Notificaciones',
      icon: <Icon name="bell" size={32} color="#FFFFFF" />,
      onPress: handleNotificaciones,
    },
    {
      id: 'asistencia',
      title: 'Asistencia',
      icon: <Icon name="help-circle" size={32} color="#FFFFFF" />,
      onPress: handleAsistencia,
    },
  ];

  const SettingItem = ({ option }: { option: SettingOption }) => (
    <TouchableOpacity style={styles.settingItem} onPress={option.onPress}>
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
              <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
                <View style={styles.iconContainer}>
                  <Icon name="log-out" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>Versión 1.0.0</Text>
              <Text style={styles.infoSubtext}>© 2024 Tango Shop</Text>
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
      <NavBar activeScreen={activeScreen} />
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
  settingIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  settingTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
    flex: 1,
    fontFamily: 'Segoe UI',
  },
  settingArrow: {
    fontSize: 20,
    color: '#C0C0C0',
    fontWeight: '300',
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
  logoutIcon: {
    fontSize: 32,
    color: '#FFFFFF',
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