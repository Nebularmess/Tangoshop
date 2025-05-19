import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Proveedores = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Proveedores</Text>
      <Text>Contenido de la pantalla de Proveedores</Text>
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

export default Proveedores;