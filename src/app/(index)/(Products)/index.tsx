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
import {
  getProductsWithFavorites,
  searchProductsWithFavorites
} from '../../../utils/queryProduct';

// Interface para el producto del backend CON información de favoritos
interface BackendProductWithFavorites {
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
  saved_by_user: {
    _id: string;
    type: string;
    from: string;
    to: string;
    props?: {
      type_of_profit: 'mount' | 'percentage';
      value: number;
    };
  }[]; // Array vacío = no guardado, con elementos = guardado
  tags?: string[];
  owner?: string;
  status?: string;
}

// Interface para la respuesta de la API
interface ProductsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: BackendProductWithFavorites[];
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
}

// Función para transformar datos del backend al formato que espera tu UI
const transformProduct = (backendProduct: BackendProductWithFavorites): Producto => {
  return {
    id: backendProduct._id,
    imageUri: backendProduct.image || backendProduct.props?.images?.[0] || '',
    name: backendProduct.name,
    rating: 4.5, // Por defecto
    category: backendProduct.object_type?.[0]?.name || 'Sin categoría',
    subcategory: backendProduct.object_type?.[0]?.name || 'Sin categoría',
    description: backendProduct.description,
    price: backendProduct.props?.price || 0,
    favorite: backendProduct.saved_by_user && backendProduct.saved_by_user.length > 0, // TRUE si está guardado
  };
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [activeScreen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Hook para obtener datos del backend
  const { data: products, execute: fetchProducts, loading: loadingProducts } = usefetch<ProductsApiResponse>();
  
  // Hook para crear/eliminar favoritos
  const { execute: createFavorite, loading: loadingCreate } = usefetch();
  const { execute: deleteFavorite, loading: loadingDelete } = usefetch();

  // Obtener userData del localStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          setUserId(userData._id); // Ajusta según cómo tengas guardado el ID
          setUserEmail(userData.email); // Para el tag
          console.log('✅ Usuario cargado:', userData._id, userData.email);
        } else {
          console.log('❌ No hay usuario en localStorage');
        }
      } catch (error) {
        console.error('❌ Error obteniendo userData:', error);
      }
    };

    getUserData();
  }, []);

  // Cargar productos con información de favoritos cuando tenemos el userId
  useEffect(() => {
    if (userId) {
      console.log('🔄 Cargando productos con favoritos para userId:', userId);
      fetchProducts({ method: 'post', url: '/api/findObjects', data: getProductsWithFavorites(userId) });
    }
  }, [userId]);

  // Efecto para filtrar productos cuando cambia la búsqueda o llegan nuevos datos
  useEffect(() => {
    if (!products?.items) {
      setProductosFiltrados([]);
      return;
    }

    const transformedProducts = products.items.map(transformProduct);

    if (searchQuery.trim() === '') {
      setProductosFiltrados(transformedProducts);
    } else {
      const filtrados = transformedProducts.filter(producto => 
        producto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        producto.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        producto.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  }, [searchQuery, products]);

  // Función para buscar productos en el backend
  const searchProductsInBackend = async (query: string) => {
    if (!userId) return;

    if (!query.trim()) {
      fetchProducts({ method: 'post', url: '/api/findObjects', data: getProductsWithFavorites(userId) });
      return;
    }

    try {
      await fetchProducts({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: searchProductsWithFavorites(userId, query) 
      });
    } catch (error) {
      console.error('Error buscando productos:', error);
    }
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProductsInBackend(searchQuery);
      } else {
        if (userId) {
          fetchProducts({ method: 'post', url: '/api/findObjects', data: getProductsWithFavorites(userId) });
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, userId]);

  const handleToggleFavorite = async (productId: string) => {
    if (!userId || !userEmail) {
      Alert.alert('Error', 'No se pudo obtener información del usuario');
      return;
    }

    const producto = productosFiltrados.find(p => p.id === productId);
    if (!producto) return;

    setProductosFiltrados(prevProductos => 
      prevProductos.map(p => 
        p.id === productId 
          ? { ...p, favorite: !p.favorite }
          : p
      )
    );

    try {
      if (producto.favorite) {
        console.log('🗑️ Eliminando de favoritos:', productId);
        console.log('✅ Producto eliminado de favoritos');
        
      } else {
        console.log('❤️ Agregando a favoritos:', productId);
        
        const savedProductData = {
          type: "saved_product",
          from: userId,
          to: productId,
          tags: [userEmail],
          props: {
            type_of_profit: "mount",
            value: 0
          }
        };

        await createFavorite({ 
          method: 'post', 
          url: '/api/createObject', 
          data: savedProductData 
        });
        
        console.log('✅ Producto agregado a favoritos');
      }

      if (userId) {
        await fetchProducts({ method: 'post', url: '/api/findObjects', data: getProductsWithFavorites(userId) });
      }

    } catch (error) {
      console.error('❌ Error al cambiar favorito:', error);
      
      setProductosFiltrados(prevProductos => 
        prevProductos.map(p => 
          p.id === productId 
            ? { ...p, favorite: !p.favorite } 
            : p
        )
      );
      
      Alert.alert('Error', 'No se pudo actualizar el favorito. Intenta de nuevo.');
    }
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
    
    if (filters.categories && filters.categories.length > 0) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto =>
        filters.categories.some((cat: string) => 
          producto.category.toLowerCase().includes(cat.toLowerCase()) ||
          producto.subcategory.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }
    
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
    fetchProducts({ method: 'post', url: '/api/findObjects', data: getProductsWithFavorites(userId) })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const NoResultsComponent = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>
        {searchQuery.trim() 
          ? `No se encontraron productos que coincidan con "${searchQuery}"`
          : "No hay productos disponibles"
        }
      </Text>
    </View>
  );

  // Mostrar loading si no tenemos userId aún
  if (!userId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando información del usuario...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
              onFilterPress={handleFilterPress}
            />
          </Header>
          
          <GenericList
            data={productosFiltrados}
            renderItem={renderProducto}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<NoResultsComponent />}
            contentContainerStyle={styles.listContent}
            isLoading={loadingProducts || loadingCreate || loadingDelete}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            emptyText={searchQuery.trim() 
              ? `No se encontraron productos que coincidan con "${searchQuery}"`
              : "No hay productos disponibles"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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