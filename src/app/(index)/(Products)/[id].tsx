import { productosEjemplo } from '@/src/utils/scripts';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ProductoDetalle() {
  const { id } = useLocalSearchParams();
  const producto = productosEjemplo.find((p) => p.id === Number(id));

  if (!producto) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>Producto no encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Nombre: {producto.name}</Text>
      <Text>ID: {producto.id}</Text>
      <Text>Descripción: {producto.description}</Text>
      <Text>Precio: ${producto.price}</Text>
      <Text>Categoría: {producto.category}</Text>
    </View>
  );
}
