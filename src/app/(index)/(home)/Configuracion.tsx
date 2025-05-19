import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Configuracion = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Configuracion</Text>
      <Text>Contenido de la pantalla de Configuracion</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Configuracion;