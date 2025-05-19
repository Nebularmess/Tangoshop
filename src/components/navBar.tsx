// src/components/NavBar.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface NavBarProps {
  activeScreen: 'index' | 'Proveedores' | 'Buscador' | 'Favoritos' | 'Configuracion';
}

const NavBar: React.FC<NavBarProps> = ({ activeScreen }) => {
  const navigation = useNavigation();

  // Configuración de los iconos para cada pantalla
  const screens = [
    {
      id: 'index',
      activeIcon: 'home',
      inactiveIcon: 'home-outline',
      label: 'Inicio',
      routeName: 'Index'
    },
    {
      id: 'Proveedores',
      activeIcon: 'cart',
      inactiveIcon: 'cart-outline',
      label: 'Proveedores',
      routeName: 'Proveedores'
    },
    {
      id: 'Buscador',
      activeIcon: 'search',
      inactiveIcon: 'search-outline',
      label: 'Buscar',
      routeName: 'Buscador'
    },
    {
      id: 'Favoritos',
      activeIcon: 'heart',
      inactiveIcon: 'heart-outline',
      label: 'Favoritos',
      routeName: 'Favoritos'
    },
    {
      id: 'Configuracion',
      activeIcon: 'settings',
      inactiveIcon: 'settings-outline',
      label: 'Ajustes',
      routeName: 'Configuracion'
    }
  ];

  // Función para navegar a la pantalla seleccionada
  const navigateToScreen = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  return (
    <View style={styles.container}>
      {screens.map((screen) => (
        <TouchableOpacity
          key={screen.id}
          style={[
            styles.tabButton,
            activeScreen === screen.id ? styles.activeTab : null
          ]}
          onPress={() => navigateToScreen(screen.routeName)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeScreen === screen.id ? screen.activeIcon as any : screen.inactiveIcon as any}
            size={24}
            color={activeScreen === screen.id ? '#FFFFFF' : '#888888'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    height: 56,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#0095ff',
  }
});

export default NavBar;