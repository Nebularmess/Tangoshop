import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GenericList from '../../../components/genericList';
import Header from '../../../components/header';
import FilterPopup from '../../../components/products/FilterPopUp'; // Importa el nuevo componente
import ProductCard from '../../../components/products/ProductCard';
import SearchBar from '../../../components/products/productsSearchBar';
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
  favorite: boolean;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productos, setProductos] = useState<Producto[]>(productosEjemplo);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>(productos);
  const [activeScreen] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Nuevo estado para controlar el popup de filtros
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState<boolean>(false);

  // Efecto para filtrar productos cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setProductosFiltrados(productos);
    } else {
      const propertiesToSearch: (keyof Producto)[] = ['name', 'category', 'description', 'subcategory'];
      const filtrados = productos.filter(producto =>
        propertiesToSearch.some(prop => {
          const value = producto[prop];
          return value !== undefined &&
                 value !== null &&
                 value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
      setProductosFiltrados(filtrados);
    }
  }, [searchQuery, productos]);

  const handleToggleFavorite = (productId: number) => {
    setProductos(prevProductos => 
      prevProductos.map(producto => 
        producto.id === productId 
          ? { ...producto, favorite: !producto.favorite }
          : producto
      )
    );
  };

  // Función para manejar el cambio en el texto de búsqueda
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Función para abrir el popup de filtros
  const handleFilterPress = () => {
    setIsFilterPopupVisible(true);
  };

  // Función para cerrar el popup de filtros
  const handleCloseFilterPopup = () => {
    setIsFilterPopupVisible(false);
  };

  // Función para aplicar filtros (puedes expandir esta lógica)
  const handleApplyFilters = (filters: any) => {
    console.log('Filtros aplicados:', filters);
    
    let productosFiltradosTemp = productos;
    
    // Aplicar filtro de búsqueda si existe
    if (searchQuery.trim() !== '') {
      const propertiesToSearch: (keyof Producto)[] = ['name', 'category', 'description', 'subcategory'];
      productosFiltradosTemp = productosFiltradosTemp.filter(producto =>
        propertiesToSearch.some(prop => {
          const value = producto[prop];
          return value !== undefined &&
                 value !== null &&
                 value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }
    
    // Aplicar filtro de categorías
    if (filters.categories && filters.categories.length > 0) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto =>
        filters.categories.some((cat: string) => 
          producto.category.toLowerCase().includes(cat.toLowerCase()) ||
          producto.subcategory.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }
    
    // Aplicar filtro de precios
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto => {
        return filters.priceRanges.some((range: string) => {
          switch (range) {
            case '0-50':
              return producto.price >= 0 && producto.price <= 50;
            case '50-100':
              return producto.price > 50 && producto.price <= 100;
            case '100+':
              return producto.price > 100;
            default:
              return true;
          }
        });
      });
    }
    
    // Aplicar filtro de rating
    if (filters.ratings && filters.ratings.length > 0) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto => {
        return filters.ratings.some((rating: string) => {
          switch (rating) {
            case '5':
              return producto.rating === 5;
            case '4+':
              return producto.rating >= 4;
            case '3+':
              return producto.rating >= 3;
            default:
              return true;
          }
        });
      });
    }
    
    setProductosFiltrados(productosFiltradosTemp);
    setIsFilterPopupVisible(false);
  };

  const router = useRouter();
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
      favorite={producto.favorite}
      onPress={() => {try{ router.push(`/${producto.id}`)}catch(e){console.error(e)}}} 
      onToggleFavorite={handleToggleFavorite}
    />
  );

  // Función para refrescar los datos
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Componente para mostrar cuando no hay resultados
  const NoResultsComponent = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>
        No se encontraron productos que coincidan con &quot;{searchQuery}&quot;
      </Text>
    </View>
  );

  const renderScreen = () => {
    if (activeScreen) {
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
              onFilterPress={handleFilterPress} // Pasamos la función al SearchBar
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

          
          <FilterPopup
            visible={isFilterPopupVisible}
            onClose={handleCloseFilterPopup}
            onApplyFilters={handleApplyFilters}
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