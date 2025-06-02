
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ProductCard from '../../../components/ProductCard';
import GenericList from '../../../components/genericList';
import Header from '../../../components/header';
import SearchBar from '../../../components/searchBar';
import { productosEjemplo } from '../../../utils/scripts';

interface Producto {
  id: number;
  imageUri: string;
  name: string;
  rating: number;
  category: string;
  subcategory: string;
  description: string;
  price: number;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productos] = useState<Producto[]>(productosEjemplo);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>(productos);
  // Cambiado el estado inicial para coincidir con el NavBar
  const [activeScreen] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Efecto para filtrar productos cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Si la búsqueda está vacía, mostrar todos los productos
      setProductosFiltrados(productos);
    } else {
      // Filtrar por nombre ignorando mayúsculas/minúsculas
      const filtrados = productos.filter(producto => 
        producto.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  }, [searchQuery, productos]);

  // Función para manejar el cambio en el texto de búsqueda
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Función para renderizar un producto
  const renderProducto = (producto: Producto) => (
    <ProductCard
      id={producto.id}
      imageUri={producto.imageUri}
      name={producto.name}
      rating={producto.rating}
      category={producto.category}
      subcategory={producto.subcategory}
      description={producto.description}
      price={producto.price}
      onPress={() => console.log(`Producto seleccionado: ${producto.name}`)}
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
        No se encontraron productos que coincidan con "{searchQuery}"
      </Text>
    </View>
  );

  const renderScreen = () => {
    if(activeScreen) {
      return (
        <>
          <Header 
            title="Productos" 
            subtitle="¿Qué estás buscando hoy?"
          >
            <SearchBar
              placeholder="Buscar producto"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </Header>
          
          <GenericList
            data={productosFiltrados}
            renderItem={renderProducto}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<NoResultsComponent />}
            contentContainerStyle={styles.listContent}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            emptyText={`No se encontraron productos que coincidan con "${searchQuery}"`}
          />
        </>
      );
    }
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