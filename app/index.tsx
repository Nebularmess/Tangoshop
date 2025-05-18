import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GenericList from './components/genericList';
import Header from './components/header';
import NavBar from './components/navBar';
import ProviderCard from './components/ProviderCard';
import SearchBar from './components/searchBar';

// Datos de ejemplo para proveedores
const proveedoresEjemplo = [
  {
    id: 48,
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
    id: 49,
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
    id: 50,
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
    id: 51,
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
  id: number;
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

// Modificar para usar los mismos nombres de pantalla que en NavBar
type Screen = 'index' | 'Proveedores' | 'Buscador' | 'Favoritos' | 'Configuracion';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [proveedores] = useState<Proveedor[]>(proveedoresEjemplo);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<Proveedor[]>(proveedores);
  // Cambiado el estado inicial para coincidir con el NavBar
  const [activeScreen, setActiveScreen] = useState<Screen>('index');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Efecto para filtrar proveedores cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Si la búsqueda está vacía, mostrar todos los proveedores
      setProveedoresFiltrados(proveedores);
    } else {
      // Filtrar por nombre ignorando mayúsculas/minúsculas
      const filtrados = proveedores.filter(proveedor => 
        proveedor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProveedoresFiltrados(filtrados);
    }
  }, [searchQuery, proveedores]);

  // Función para manejar el cambio en el texto de búsqueda
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Función para renderizar un proveedor
  const renderProveedor = (proveedor: Proveedor) => (
    <ProviderCard
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
  );

  // Función para refrescar los datos
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Aquí normalmente harías una llamada a API para obtener datos frescos
    // Simulamos un delay para mostrar el refreshing
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Componente para mostrar cuando no hay resultados
  const NoResultsComponent = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>
        No se encontraron proveedores que coincidan con "{searchQuery}"
      </Text>
    </View>
  );


  const renderScreen = () => {
    switch (activeScreen) {
      case 'index':
        return (
          <>
            <Header 
              title="Proveedores" 
              subtitle="¿Qué estás buscando hoy?"
            >
              <SearchBar
                placeholder="Buscar proveedores"
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
            </Header>
            
            <GenericList
              data={proveedoresFiltrados}
              renderItem={renderProveedor}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<NoResultsComponent />}
              contentContainerStyle={styles.listContent}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
              emptyText={`No se encontraron proveedores que coincidan con "${searchQuery}"`}
            />
          </>
        );
      case 'Buscador':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Búsqueda Avanzada</Text>
            <SearchBar
              placeholder="Buscar por nombre, categoría o ciudad"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
        );
      case 'Proveedores': // Cambiado de 'list' a 'provider'
        return (
          <>
            <Header 
              title="Listado Completo" 
              subtitle="Todos los proveedores disponibles"
            />
            <GenericList
              data={proveedores}
              renderItem={renderProveedor}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
          </>
        );
      case 'Favoritos':
        return (
          <>
            <Header 
              title="Favoritos" 
              subtitle="Tus proveedores guardados"
            />
            <GenericList
              data={[]} // Lista vacía para demostrar el emptyComponent
              renderItem={renderProveedor}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              emptyText="No tienes proveedores favoritos"
            />
          </>
        );
      case 'Configuracion':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Configuración</Text>
            <Text style={styles.screenText}>Ajustes de la aplicación.</Text>
          </View>
        );
      default:
        return null;
    }
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
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  screenContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  screenText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default Index;