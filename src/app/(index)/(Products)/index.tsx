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
  getFilteredProductsWithFavorites,
  getProductsWithFavorites,
  searchFilteredProductsWithFavorites,
  searchProductsWithFavorites
} from '../../../utils/queryProduct';

// Interface para filtros
interface ProductFilters {
  categories?: string[];
  priceRanges?: string[];
  ratings?: string[];
  tags?: string[];
}

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
  tags?: string[]; // Agregar tags
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
    favorite: backendProduct.saved_by_user && backendProduct.saved_by_user.length > 0,
    tags: backendProduct.tags || [], // Incluir tags
  };
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [productosOriginales, setProductosOriginales] = useState<Producto[]>([]); // Para aplicar filtros localmente
  const [activeScreen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({}); // Estado para filtros activos

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
          setUserId(userData._id);
          setUserEmail(userData.email);
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

  // Función para cargar productos con filtros
  const loadProductsWithFilters = async (filters: ProductFilters = {}, searchText: string = '') => {
    if (!userId) return;

    try {
      const hasBackendFilters = (filters.categories && filters.categories.length > 0) ||
                               (filters.tags && filters.tags.length > 0);

      let queryData;
      
      if (hasBackendFilters) {
        // Si hay filtros que necesitan el backend (categories, tags)
        if (searchText.trim()) {
          console.log('🔍 Buscando con filtros backend:', searchText, filters);
          queryData = searchFilteredProductsWithFavorites(userId, searchText, filters);
        } else {
          console.log('🔧 Aplicando filtros backend:', filters);
          queryData = getFilteredProductsWithFavorites(userId, filters);
        }
      } else {
        // Sin filtros backend, usar las queries originales
        if (searchText.trim()) {
          console.log('🔍 Búsqueda simple:', searchText);
          queryData = searchProductsWithFavorites(userId, searchText);
        } else {
          console.log('📋 Cargando todos los productos');
          queryData = getProductsWithFavorites(userId);
        }
      }

      await fetchProducts({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: queryData 
      });
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
    }
  };

  // Cargar productos cuando tenemos el userId
  useEffect(() => {
    if (userId) {
      console.log('🔄 Cargando productos para userId:', userId);
      loadProductsWithFilters(activeFilters, searchQuery);
    }
  }, [userId]);

  // Efecto para procesar productos cuando llegan del backend
  useEffect(() => {
    if (!products?.items) {
      setProductosOriginales([]);
      setProductosFiltrados([]);
      return;
    }

    const transformedProducts = products.items.map(transformProduct);
    setProductosOriginales(transformedProducts);
    
    // Aplicar filtros locales (precio y rating)
    applyLocalFilters(transformedProducts, activeFilters);
  }, [products]);

  // Función para aplicar filtros que se manejan localmente (precio y rating)
  const applyLocalFilters = (productos: Producto[], filters: ProductFilters) => {
    let productosFiltradosTemp = [...productos];
    
    // Filtro por rango de precio (local)
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto => {
        return filters.priceRanges!.some((range: string) => {
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
       
    // Filtro por rating (local)
    if (filters.ratings && filters.ratings.length > 0) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto => {
        return filters.ratings!.some((rating: string) => {
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
  };

  // Efecto para manejar búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProductsWithFilters(activeFilters, searchQuery);
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

    // Actualización optimista
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
        // Aquí iría la lógica para eliminar favorito
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

      // Recargar productos para mantener consistencia
      await loadProductsWithFilters(activeFilters, searchQuery);

    } catch (error) {
      console.error('❌ Error al cambiar favorito:', error);
      
      // Revertir cambio optimista
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

  const handleApplyFilters = async (filters: ProductFilters) => {
    console.log('🔧 Filtros aplicados:', filters);
    
    setActiveFilters(filters);
    
    // Cargar productos con los nuevos filtros
    await loadProductsWithFilters(filters, searchQuery);
    
    setIsFilterPopupVisible(false);
  };

  // Función para limpiar todos los filtros
  const handleClearFilters = async () => {
    console.log('🧹 Limpiando filtros');
    setActiveFilters({});
    await loadProductsWithFilters({}, searchQuery);
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

  const handleRefresh = async () => {
    if (!userId) return;
    
    setIsRefreshing(true);
    try {
      await loadProductsWithFilters(activeFilters, searchQuery);
    } finally {
      setIsRefreshing(false);
    }
  };

  const NoResultsComponent = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>
        {searchQuery.trim() 
          ? `No se encontraron productos que coincidan con "${searchQuery}"`
          : "No hay productos disponibles"
        }
      </Text>
      {Object.values(activeFilters).some(filter => Array.isArray(filter) && filter.length > 0) && (
        <Text style={styles.clearFiltersText} onPress={handleClearFilters}>
          Limpiar filtros
        </Text>
      )}
    </View>
  );

  // Función para mostrar filtros activos
  const renderActiveFilters = () => {
    const hasActiveFilters = Object.values(activeFilters).some(filter => 
      Array.isArray(filter) && filter.length > 0
    );

    if (!hasActiveFilters) return null;

    return (
      <View style={styles.activeFiltersContainer}>
        <Text style={styles.activeFiltersTitle}>Filtros activos:</Text>
        <View style={styles.filterTagsContainer}>
          {activeFilters.categories?.map((category, index) => (
            <View key={`cat-${index}`} style={styles.filterTag}>
              <Text style={styles.filterTagText}>📂 {category}</Text>
            </View>
          ))}
          {activeFilters.tags?.map((tag, index) => (
            <View key={`tag-${index}`} style={styles.filterTag}>
              <Text style={styles.filterTagText}>🏷️ {tag}</Text>
            </View>
          ))}
          {activeFilters.priceRanges?.map((price, index) => (
            <View key={`price-${index}`} style={styles.filterTag}>
              <Text style={styles.filterTagText}>💰 ${price}</Text>
            </View>
          ))}
          {activeFilters.ratings?.map((rating, index) => (
            <View key={`rating-${index}`} style={styles.filterTag}>
              <Text style={styles.filterTagText}>⭐ {rating}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.clearFiltersButton} onPress={handleClearFilters}>
          Limpiar todos los filtros
        </Text>
      </View>
    );
  };

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
          
          {renderActiveFilters()}
          
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
            activeFilters={activeFilters} // Pasar filtros activos al popup
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
    marginBottom: 10,
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
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
  },
  // Estilos para filtros activos
  activeFiltersContainer: {
    backgroundColor: '#E3F2FD',
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  filterTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  filterTag: {
    backgroundColor: '#BBDEFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filterTagText: {
    fontSize: 12,
    color: '#0D47A1',
  },
  clearFiltersButton: {
    fontSize: 12,
    color: '#D32F2F',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Index;