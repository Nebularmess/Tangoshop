import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Buscador from '../app/(index)/(home)/Buscador';
import Configuracion from '../app/(index)/(home)/Configuracion';
import Favoritos from '../app/(index)/(home)/Favoritos';
import Index from '../app/(index)/(home)/index';
import Proveedores from '../app/(index)/(home)/Proveedores';
import NavBar from './navBar';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [activeScreen, setActiveScreen] = useState<'index' | 'Proveedores' | 'Buscador' | 'Favoritos' | 'Configuracion'>('index');

  // Función para actualizar la pantalla activa cuando cambia la navegación
  const handleScreenChange = (routeName: string) => {
    switch (routeName) {
      case 'index':
        setActiveScreen('index');
        break;
      case 'Proveedores':
        setActiveScreen('Proveedores');
        break;
      case 'Buscador':
        setActiveScreen('Buscador');
        break;
      case 'Favoritos':
        setActiveScreen('Favoritos');
        break;
      case 'Configuracion':
        setActiveScreen('Configuracion');
        break;
    }
  };

  return (
    <NavigationContainer
      onStateChange={(state) => {
        const currentRouteName = state?.routes[state.index]?.name;
        if (currentRouteName) {
          handleScreenChange(currentRouteName);
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" component={Index} />
            <Stack.Screen name="Proveedores" component={Proveedores} />
            <Stack.Screen name="Buscador" component={Buscador} />
            <Stack.Screen name="Favoritos" component={Favoritos} />
            <Stack.Screen name="Configuracion" component={Configuracion} />
          </Stack.Navigator>
        </View>
        
        <NavBar activeScreen={activeScreen} />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default AppNavigator;