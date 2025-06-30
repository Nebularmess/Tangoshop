import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GenericList from '../../../components/genericList';
import Header from '../../../components/header';
import FilterPopup from '../../../components/products/FilterPopUp';
import ProductCard from '../../../components/products/ProductCard';
import SearchBar from '../../../components/products/productsSearchBar';
import usefetch from "../../../hooks/useFetch";
import { getSavedProducts, searchSavedProducts } from '../../../utils/queryProduct'; // Nuevas queries

// Interface para el producto del backend con relación de guardado
interface BackendSavedProduct {
  _id: string;
  name: string;
  description: string;
  image?: string;
  type: string;
  props: {
    price: number;
    images?: string[];
    [key: string]: any;
  };
  object_type: {
    _id: string;
    name: string;
    parent: string;
  }[];
  saved_relation: {
    _id: string;
    type: string;
    from: string;
    to: string;
    props: {
      type_of_profit: 'mount' | 'percentage';
      value: number;
    };
  }[];
  tags?: string[];
  owner?: string;
  status?: string;
}

// Interface para la respuesta de la API
interface SavedProductsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: BackendSavedProduct[];
}

// Interface para la UI (compatible con tu ProductCard)
interface Producto {
  id: string;
  imageUri: string;
  name: string;
  rating: number;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  favorite: boolean;
  // Campos adicionales para productos guardados
  profitType?: 'mount' | 'percentage';
  profitValue?: number;
}

// Función para transformar datos del backend al formato que espera tu UI
const transformSavedProduct = (backendProduct: BackendSavedProduct): Producto => {
  const savedRelation = backendProduct.saved_relation?.[0]; // Primer (y único) objeto de relación
  
  return {
    id: backendProduct._id,
    imageUri: backendProduct.image || backendProduct.props?.images?.[0] || '',
    name: backendProduct.name,
    rating: 4.5, // Por defecto
    category: backendProduct.object_type?.[0]?.name || 'Sin categoría',
    subcategory: backendProduct.object_type?.[0]?.name || 'Sin categoría',
    description: backendProduct.description,
    price: backendProduct.props?.price || 0,
    favorite: true, // Todos estos productos son favoritos
    // Datos del profit
    profitType: savedRelation?.props?.type_of_profit || 'mount',
    profitValue: savedRelation?.props?.value || 0,
  };
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [activeScreen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Hook para obtener datos del backend
  const { data: products, execute: fetchProducts, loading: loadingProducts } = usefetch<SavedProductsApiResponse>();

  // Obtener userId del localStorage
  useEffect(() => {
    const getUserId = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          setUserId(userData._id); // O como tengas guardado el ID
        } else {
          Alert.alert('Error', 'No se encontró información del usuario');
        }
      } catch (error) {
        console.error('Error obteniendo userId:', error);
        Alert.alert('Error', 'Error al obtener información del usuario');
      }
    };

    getUserId();
  }, []);

  // Cargar productos guardados cuando tenemos el userId
  useEffect(() => {
    if (userId) {
      fetchProducts({ method: 'post', url: '/api/findObjects', data: getSavedProducts(userId) });
    }
  }, [userId]);

  // Efecto para filtrar productos cuando cambia la búsqueda o llegan nuevos datos
  useEffect(() => {
    if (!products?.items) {
      setProductosFiltrados([]);
      return;
    }

    const transformedProducts = products.items.map(transformSavedProduct);

    if (searchQuery.trim() === '') {
      // Si la búsqueda está vacía, mostrar todos los productos guardados
      setProductosFiltrados(transformedProducts);
    } else {
      // Filtrar por nombre, categoría o descripción
      const filtrados = transformedProducts.filter(producto => 
        producto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        producto.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        producto.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  }, [searchQuery, products]);

  // Función para buscar productos guardados en el backend
  const searchSavedProductsInBackend = async (query: string) => {
    if (!userId) return;

    if (!query.trim()) {
      // Si no hay query, cargar todos los productos guardados
      fetchProducts({ method: 'post', url: '/api/findObjects', data: getSavedProducts(userId) });
      return;
    }

    try {
      // Buscar en productos guardados usando tu query de búsqueda
      await fetchProducts({ method: 'post', url: '/api/findObjects', data: searchSavedProducts(userId, query) });
    } catch (error) {
      console.error('Error buscando productos guardados:', error);
      // En caso de error, mantener la búsqueda local
    }
  };

  // Efecto para manejar búsqueda con delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSavedProductsInBackend(searchQuery);
      } else {
        // Si se borra la búsqueda, volver a cargar todos los productos guardados
        if (userId) {
          fetchProducts({ method: 'post', url: '/api/findObjects', data: getSavedProducts(userId) });
        }
      }
    }, 500); // Delay de 500ms para evitar muchas llamadas

    return () => clearTimeout(timeoutId);
  }, [searchQuery, userId]);

  // Para productos guardados, toggle significa eliminar de favoritos
  const handleToggleFavorite = async (productId: string) => {
    Alert.alert(
      'Eliminar de favoritos',
      '¿Estás seguro de que quieres eliminar este producto de tus favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: () => {
            // TODO: Aquí llamarías al backend para eliminar la relación saved_product
            console.log('Eliminar producto de favoritos:', productId);
            
            // Por ahora, solo actualizar UI localmente
            setProductosFiltrados(prev => prev.filter(p => p.id !== productId));
          }
        }
      ]
    );
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterPress = () => {
    setIsFilterPopupVisible(true);
  };

  const handleCloseFilterPopup = () => {
    setIsFilterPopupVisible(false);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Filtros aplicados:', filters);
    
    let productosFiltradosTemp = productosFiltrados;
    
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
      onPress={() => {
        try{ 
          router.push(`/${producto.id}` as any);
        } catch(e) {
          console.error(e);
        }
      }} 
      onToggleFavorite={() => handleToggleFavorite(producto.id)}
    />
  );

  const handleRefresh = () => {
    if (!userId) return;
    
    setIsRefreshing(true);
    fetchProducts({ method: 'post', url: '/api/findObjects', data: getSavedProducts(userId) })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const NoResultsComponent = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>
        {searchQuery.trim() 
          ? `No se encontraron productos guardados que coincidan con "${searchQuery}"`
          : "No tienes productos guardados aún"
        }
      </Text>
      <Text style={styles.noResultsSubText}>
        {!searchQuery.trim() && "Ve a la sección de productos y marca algunos como favoritos"}
      </Text>
    </View>
  );

  const renderScreen = () => {
    if (activeScreen) {
      return (
        <>
          <Header 
            title="Mis Productos" 
            subtitle="Tus productos guardados"
          >
            <SearchBar
              placeholder="Buscar en mis productos"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFilterPress={handleFilterPress}
            />
          </Header>
          
          <GenericList
            data={productosFiltrados}
            renderItem={renderProducto}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<NoResultsComponent />}
            contentContainerStyle={styles.listContent}
            isLoading={loadingProducts}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            emptyText={searchQuery.trim() 
              ? `No se encontraron productos guardados que coincidan con "${searchQuery}"`
              : "No tienes productos guardados"
            }
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
    marginBottom: 8,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
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