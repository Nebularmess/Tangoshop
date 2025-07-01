import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ProductCard from '../(home)/components/ProductCard';
import GenericList from '../../../components/genericList';
import Header from '../../../components/header';
import FilterPopup from '../../../components/products/FilterPopUp';
import SearchBar from '../../../components/products/productsSearchBar';
import usefetch from "../../../hooks/useFetch";
import {
    getFilteredProductsWithFavorites,
    getSavedProducts,
    ProductFilters,
    searchFilteredProductsWithFavorites,
    searchProductsWithFavorites
} from '../../../utils/queryProduct';

// Interface para el producto del backend (misma estructura que el index)
interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  categorie: string;
  type: string;
  tags: string[];
  props: {
    price: number;
    images: string[];
  };
  saved_product: { _id: string }[]; // Solo productos con esta relación no vacía
}

// Interface para la respuesta de la API
interface ProductsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: BackendProduct[];
}

const FavoritesIndex = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productos, setProductos] = useState<BackendProduct[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<BackendProduct[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});

  // Hook para obtener datos del backend
  const { data: products, execute: fetchProducts, loading: loadingProducts } = usefetch<ProductsApiResponse>();
  
  const router = useRouter();

  // Obtener userData del AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          setUserId(userData._id);
          setUserEmail(userData.email);
          console.log('✅ Usuario cargado en favoritos:', userData._id, userData.email);
        } else {
          console.log('❌ No hay usuario en AsyncStorage');
        }
      } catch (error) {
        console.error('❌ Error obteniendo userData:', error);
      }
    };

    getUserData();
  }, []);

  // Función para cargar solo productos favoritos con filtros
  const loadFavoriteProductsWithFilters = async (filters: ProductFilters = {}, searchText: string = '') => {
    if (!userId) return;

    try {
      const hasBackendFilters = (filters.categories && filters.categories.length > 0) ||
                               (filters.tags && filters.tags.length > 0) ||
                               filters.type;

      let queryData;
      
      if (hasBackendFilters) {
        // Si hay filtros que necesitan el backend (categories, tags, type)
        if (searchText.trim()) {
          console.log('🔍❤️ Buscando favoritos con filtros backend:', searchText, filters);
          queryData = searchFilteredProductsWithFavorites(userId, searchText, filters);
        } else {
          console.log('🔧❤️ Aplicando filtros backend a favoritos:', filters);
          queryData = getFilteredProductsWithFavorites(userId, filters);
        }
      } else {
        // Sin filtros backend, usar query para obtener todos los favoritos
        if (searchText.trim()) {
          console.log('🔍❤️ Búsqueda simple en favoritos:', searchText);
          queryData = searchProductsWithFavorites(userId, searchText);
        } else {
          console.log('❤️ Cargando todos los productos favoritos');
          queryData = getSavedProducts(userId);
        }
      }

      await fetchProducts({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: queryData 
      });
    } catch (error) {
      console.error('❌ Error cargando productos favoritos:', error);
    }
  };

  // Cargar productos favoritos cuando tenemos el userId o cambian los filtros activos
  useEffect(() => {
    if (userId) {
      console.log('🔄❤️ Cargando productos favoritos para userId:', userId, 'con filtros:', activeFilters);
      loadFavoriteProductsWithFilters(activeFilters, searchQuery);
    }
  }, [userId, activeFilters]);

  // Efecto para procesar productos cuando llegan del backend
  useEffect(() => {
    if (!products?.items) {
      setProductos([]);
      setProductosFiltrados([]);
      return;
    }

    // Filtrar solo productos que realmente tengan saved_product no vacío
    const favoriteProducts = products.items.filter(product => 
      product.saved_product && product.saved_product.length > 0
    );

    console.log('❤️ Productos favoritos encontrados:', favoriteProducts.length, 'de', products.items.length);
    
    setProductos(favoriteProducts);
    
    // Aplicar filtros locales (precio y rating)
    applyLocalFilters(favoriteProducts, activeFilters);
  }, [products]);

  // Función para aplicar filtros que se manejan localmente (precio y rating)
  const applyLocalFilters = (productos: BackendProduct[], filters: ProductFilters) => {
    let productosFiltradosTemp = [...productos];
    
    // Filtro por rango de precio (local)
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto => {
        const price = producto.props?.price || 0;
        return filters.priceRanges!.some((range: string) => {
          switch (range) {
            case '0-50':
              return price >= 0 && price <= 50;
            case '50-100':
              return price > 50 && price <= 100;
            case '100+':
              return price > 100;
            default:
              return true;
          }
        });
      });
    }
       
    // Filtro por rating (local)
    if (filters.ratings && filters.ratings.length > 0) {
      productosFiltradosTemp = productosFiltradosTemp.filter(producto => {
        // Por ahora usamos un rating por defecto, ajusta según tu lógica
        const rating: number = 5; // Cambia este valor según la lógica real de rating
        return filters.ratings!.some((ratingFilter: string) => {
          switch (ratingFilter) {
            case '5':
              return rating === 5;
            case '4+':
              return rating >= 4;
            case '3+':
              return rating >= 3;
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
      if (userId) {
        loadFavoriteProductsWithFilters(activeFilters, searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, userId]);


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
    console.log('🔧❤️ Filtros aplicados a favoritos:', filters);
    setActiveFilters(filters);
    
    // Cargar productos favoritos con los nuevos filtros
    await loadFavoriteProductsWithFilters(filters, searchQuery);
    
    setIsFilterPopupVisible(false);
  };

  // Función para limpiar todos los filtros
  const handleClearFilters = async () => {
    console.log('🧹❤️ Limpiando filtros de favoritos');
    setActiveFilters({});
    await loadFavoriteProductsWithFilters({}, searchQuery);
  };

  const renderProducto = (producto: BackendProduct) => (
    <ProductCard product={producto} />
  );

  const handleRefresh = async () => {
    if (!userId) return;
    
    setIsRefreshing(true);
    try {
      await loadFavoriteProductsWithFilters(activeFilters, searchQuery);
    } finally {
      setIsRefreshing(false);
    }
  };

  const NoResultsComponent = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>
        {searchQuery.trim() 
          ? `No se encontraron productos favoritos que coincidan con "${searchQuery}"`
          : "No tienes productos favoritos aún"
        }
      </Text>
      {!searchQuery.trim() && (
        <Text style={styles.noFavoritesSubtext}>
          Agrega productos a favoritos para verlos aquí ❤️
        </Text>
      )}
      {Object.values(activeFilters).some(filter => 
        (Array.isArray(filter) && filter.length > 0) || 
        (typeof filter === 'string' && filter !== '')
      ) && (
        <Text style={styles.clearFiltersText} onPress={handleClearFilters}>
          Limpiar filtros
        </Text>
      )}
    </View>
  );

  // Función para mostrar filtros activos
  const renderActiveFilters = () => {
    const hasActiveFilters = Object.entries(activeFilters).some(([key, value]) => {
      return (Array.isArray(value) && value.length > 0) || 
             (typeof value === 'string' && value !== '');
    });

    if (!hasActiveFilters) return null;

    return (
      <View style={styles.activeFiltersContainer}>
        <Text style={styles.activeFiltersTitle}>Filtros activos en favoritos:</Text>
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
          {activeFilters.type && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>📁 Tipo: {activeFilters.type}</Text>
            </View>
          )}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header 
          title="Mis Favoritos" 
          subtitle="Tus productos guardados ❤️"
        >
          <SearchBar
            placeholder="Buscar en favoritos"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFilterPress={handleFilterPress}
          />
        </Header>
        
        {/* Mostrar contador de favoritos */}
        {productos.length > 0 && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {productosFiltrados.length} de {productos.length} favoritos
              {searchQuery.trim() && ` para "${searchQuery}"`}
            </Text>
          </View>
        )}
        
        {renderActiveFilters()}
        
        <GenericList
          data={productosFiltrados}
          renderItem={renderProducto}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<NoResultsComponent />}
          contentContainerStyle={styles.listContent}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          emptyText={searchQuery.trim() 
            ? `No se encontraron productos favoritos que coincidan con "${searchQuery}"`
            : "No tienes productos favoritos aún"
          }
        />

        <FilterPopup
          visible={isFilterPopupVisible}
          onClose={handleCloseFilterPopup}
          onApplyFilters={handleApplyFilters}
          activeFilters={activeFilters}
        />
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
  noFavoritesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  counterContainer: {
    backgroundColor: '#E8F5E8',
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  counterText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  // Estilos para filtros activos
  activeFiltersContainer: {
    backgroundColor: '#FFF3E0',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 5,
  },
  filterTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  filterTag: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filterTagText: {
    fontSize: 12,
    color: '#BF360C',
  },
  clearFiltersButton: {
    fontSize: 12,
    color: '#D32F2F',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default FavoritesIndex;