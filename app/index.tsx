import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './components/header';
import SearchBar from './components/searchBar';
// Ajusta esta ruta según donde hayas guardado el componente ProviderCard
import ProviderCard from './components/ProviderCard';

// Datos de ejemplo para proveedores
const proveedoresEjemplo = [
  {
    id: '48',
    imageUri: 'https://picsum.photos/100',
    name: 'Carlos Bisordi',
    rating: 5,
    category: 'Mayorista',
    subcategory: 'Deportes',
    description: 'Equipamiento Deportivo',
    city: 'Resistencia',
    address: 'Calle texto, 1234',
    phone: '+54 362 412 345',
    email: 'contacto@gmail.com'
  },
  {
    id: '49',
    imageUri: 'https://picsum.photos/60',
    name: 'Luis A. Cuadrado',
    rating: 4,
    category: 'Minorista',
    subcategory: 'Oficina',
    description: 'Artículos para la Oficina',
    city: 'Resistencia',
    address: 'Av. Principal, 567',
    phone: '+54 362 420 789',
    email: 'luis@comercial.com'
  },
  {
    id: '50',
    imageUri: 'https://picsum.photos/60',
    name: 'María Gómez',
    rating: 5,
    category: 'Mayorista',
    subcategory: 'Tecnología',
    description: 'Equipos Electrónicos',
    city: 'Corrientes',
    address: 'Av. Libertad, 789',
    phone: '+54 379 445 678',
    email: 'maria@tech.com'
  },
  {
    id: '51',
    imageUri: 'https://picsum.photos/60',
    name: 'Juan Rodríguez',
    rating: 3,
    category: 'Distribuidor',
    subcategory: 'Alimentos',
    description: 'Productos Alimenticios',
    city: 'Formosa',
    address: 'Calle Central, 432',
    phone: '+54 370 432 123',
    email: 'juan@alimentos.com'
  }
];

interface Proveedor {
  id: string;
  imageUri: string;
  name: string;
  rating: number;
  category: string;
  subcategory: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [proveedores] = useState<Proveedor[]>(proveedoresEjemplo);

  const renderProveedor = ({ item }: { item: Proveedor }) => (
    <ProviderCard
      id={item.id}
      imageUri={item.imageUri}
      name={item.name}
      rating={item.rating}
      category={item.category}
      subcategory={item.subcategory}
      description={item.description}
      city={item.city}
      address={item.address}
      phone={item.phone}
      email={item.email}
      onPress={() => console.log(`Proveedor seleccionado: ${item.name}`)}
    />
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Proveedores" 
        subtitle="¿Qué estás buscando hoy?"
      >
        <SearchBar
          placeholder="Buscar proveedores"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Header>
      
      {/* Renderizado manual de proveedores sin FlatList */}
      <View style={styles.listContainer}>
        {proveedores.map((proveedor) => (
          <ProviderCard
            key={proveedor.id}
            id={proveedor.id}
            imageUri={proveedor.imageUri}
            name={proveedor.name}
            rating={proveedor.rating}
            category={proveedor.category}
            subcategory={proveedor.subcategory}
            description={proveedor.description}
            city={proveedor.city}
            address={proveedor.address}
            phone={proveedor.phone}
            email={proveedor.email}
            onPress={() => console.log(`Proveedor seleccionado: ${proveedor.name}`)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  }
});

export default Index;