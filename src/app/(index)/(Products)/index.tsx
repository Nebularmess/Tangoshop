import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ProductCard from '../(home)/components/ProductCard';
import GenericList from '../../../components/genericList';
import Header from '../../../components/header';
import FilterPopup from '../../../components/products/FilterPopUp';
import SearchBar from '../../../components/products/productsSearchBar';
import usefetch from "../../../hooks/useFetch";
import {
  getFilteredProductsWithFavorites,
  getProductsWithFavorites,
  ProductFilters,
  searchFilteredProductsWithFavorites,
  searchProductsWithFavorites
} from '../../../utils/queryProduct';

// Interface para el producto del backend (nueva estructura)
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
  saved_product: { _id: string }[];
}

// Interface para la respuesta de la API
interface ProductsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: BackendProduct[];
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productos, setProductos] = useState<BackendProduct[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<BackendProduct[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});

  // Obtener parámetros de navegación (para filtro por type)
  const params = useLocalSearchParams();
  const categoryType = params.type as string; // Parámetro de tipo de categoría

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
          console.log('✅ Usuario cargado:', userData._id, userData.email);
        } else {
          console.log('❌ No hay usuario en AsyncStorage');
        }
      } catch (error) {
        console.error('❌ Error obteniendo userData:', error);
      }
    };

    getUserData();
  }, []);

  // Aplicar filtro por type si viene de navegación desde categoría
  useEffect(() => {
    if (categoryType) {
      console.log('🔧 Aplicando filtro por tipo de categoría:', categoryType);
      setActiveFilters(prev => ({ ...prev, type: categoryType }));
    }
  }, [categoryType]);

  // Función para cargar productos con filtros
  const loadProductsWithFilters = async (filters: ProductFilters = {}, searchText: string = '') => {
    if (!userId) return;

    try {
      const hasBackendFilters = (filters.categories && filters.categories.length > 0) ||
                               (filters.tags && filters.tags.length > 0) ||
                               filters.type; // Incluir filtro por type

      let queryData;
      
      if (hasBackendFilters) {
        // Si hay filtros que necesitan el backend (categories, tags, type)
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

  // Cargar productos cuando tenemos el userId o cambian los filtros activos
  useEffect(() => {
    if (userId) {
      console.log('🔄 Cargando productos para userId:', userId, 'con filtros:', activeFilters);
      loadProductsWithFilters(activeFilters, searchQuery);
    }
  }, [userId, activeFilters]);

  // Efecto para procesar productos cuando llegan del backend
  useEffect(() => {
    if (!products?.items) {
      setProductos([]);
      setProductosFiltrados([]);
      return;
    }

    // Ya no necesitamos transformar, usamos directamente los productos del backend
    setProductos(products.items);
    
    // Aplicar filtros locales (precio y rating)
    applyLocalFilters(products.items, activeFilters);
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
            case '0-500.000':
              return price >= 0 && price <= 500000;
            case '500.000-1.000.000':
              return price > 5000000 && price <= 1000000;
            case '1.000.000+':
              return price > 1000000;
            default:
              return true;
          }
        });
      });
    }
       
    // Filtro por rating (local) - aquí puedes implementar tu lógica de rating
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
        loadProductsWithFilters(activeFilters, searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, userId]);

  const handleToggleFavorite = async (productId: string) => {
    if (!userId || !userEmail) {
      Alert.alert('Error', 'No se pudo obtener información del usuario');
      return;
    }

    const producto = productosFiltrados.find(p => p._id === productId);
    if (!producto) return;

    // Actualización optimista
    setProductosFiltrados(prevProductos => 
      prevProductos.map(p => 
        p._id === productId 
          ? { 
              ...p, 
              saved_product: p.saved_product.length > 0 ? [] : [{ _id: 'temp' }]
            }
          : p
      )
    );

    // Aquí deberías implementar la llamada al backend para guardar/quitar de favoritos
    // Por ejemplo:
    try {
      const isFavorite = producto.saved_product.length > 0;
      if (isFavorite) {
        // Llamada para quitar de favoritos
        console.log('🗑️ Quitando de favoritos:', productId);
        // await removeFavorite(userId, productId);
      } else {
        // Llamada para agregar a favoritos
        console.log('❤️ Agregando a favoritos:', productId);
        // await addFavorite(userId, productId);
      }
    } catch (error) {
      console.error('❌ Error al actualizar favorito:', error);
      // Revertir cambio optimista en caso de error
      setProductosFiltrados(prevProductos => 
        prevProductos.map(p => 
          p._id === productId 
            ? { 
                ...p, 
                saved_product: producto.saved_product
              }
            : p
        )
      );
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
    
    // Mantener el filtro de type si viene de navegación de categoría
    const updatedFilters = categoryType 
      ? { ...filters, type: categoryType }
      : filters;
    
    setActiveFilters(updatedFilters);
    
    // Cargar productos con los nuevos filtros
    await loadProductsWithFilters(updatedFilters, searchQuery);
    
    setIsFilterPopupVisible(false);
  };

  // Función para limpiar todos los filtros
  const handleClearFilters = async () => {
    console.log('🧹 Limpiando filtros');
    
    // Mantener el filtro de type si viene de navegación de categoría
    const clearedFilters = categoryType 
      ? { type: categoryType }
      : {};
    
    setActiveFilters(clearedFilters);
    await loadProductsWithFilters(clearedFilters, searchQuery);
  };

  /* 
  <ProductCard
      product={producto} // Pasamos todo el objeto del backend
      onPress={() => {
        try{ 
          router.push(`/${producto._id}` as any);
        } catch(e) {
          console.error(e);
        }
      }} 
      onToggleFavorite={() => handleToggleFavorite(producto._id)}
    />
  */

  const renderProducto = (producto: BackendProduct) => (
    <ProductCard product={producto} />
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
      if (key === 'type' && categoryType) {
        return false; // No mostrar el filtro de type si viene de navegación
      }
      return (Array.isArray(value) && value.length > 0) || 
             (typeof value === 'string' && value !== '');
    });

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
          {/* Mostrar filtro de categoría solo si NO viene de navegación */}
          {!categoryType && activeFilters.type && (
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

  // Función para renderizar el título con información de categoría
  const getHeaderTitle = () => {
    if (categoryType) {
      return `Productos - ${categoryType}`;
    }
    return "Productos";
  };

  const getHeaderSubtitle = () => {
    if (categoryType) {
      return `Explora productos de la categoría ${categoryType}`;
    }
    return "¿Qué estás buscando hoy?";
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
          title={getHeaderTitle()} 
          subtitle={getHeaderSubtitle()}
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
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<NoResultsComponent />}
          contentContainerStyle={styles.listContent}
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