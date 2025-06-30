import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GenericList from '../../../components/genericList';
import Header from '../../../components/header';
import FilterPopup from '../../../components/products/FilterPopUp';
import ProductCard from '../../../components/products/ProductCard';
import SearchBar from '../../../components/products/productsSearchBar';
import usefetch from "../../../hooks/useFetch";
import { getProducts, searchProducts } from '../../../utils/queryProduct'; // Tu archivo de queries

// Interface para el producto del backend
interface BackendProduct {
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
  tags?: string[];
  owner?: string;
  status?: string;
}

// Interface para la respuesta de la API (igual que en proveedores)
interface ProductsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: BackendProduct[];
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
const transformProduct = (backendProduct: BackendProduct): Producto => {
  return {
    id: backendProduct._id,
    imageUri: backendProduct.image || backendProduct.props?.images?.[0] || '',
    name: backendProduct.name,
    rating: 4.5, // Por defecto, podrías tener esto en tu backend
    category: backendProduct.object_type?.[0]?.name || 'Sin categoría',
    subcategory: backendProduct.object_type?.[0]?.name || 'Sin categoría',
    description: backendProduct.description,
    price: backendProduct.props?.price || 0,
    favorite: false, // Esto lo manejas localmente
  };
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [activeScreen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState<boolean>(false);

  // Hook para obtener datos del backend (igual que en proveedores)
  const { data: products, execute: fetchProducts, loading: loadingProducts } = usefetch<ProductsApiResponse>();

  // Obtener productos al cargar el componente
  useEffect(() => {
    fetchProducts({ method: 'post', url: '/api/findObjects', data: getProducts });
  }, []);

  // Efecto para filtrar productos cuando cambia la búsqueda o llegan nuevos datos
  useEffect(() => {
    if (!products?.items) {
      setProductosFiltrados([]);
      return;
    }

    const transformedProducts = products.items.map(transformProduct);

    if (searchQuery.trim() === '') {
      // Si la búsqueda está vacía, mostrar todos los productos
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

  // Función para buscar productos en el backend
  const searchProductsInBackend = async (query: string) => {
    if (!query.trim()) {
      // Si no hay query, cargar todos los productos
      fetchProducts({ method: 'post', url: '/api/findObjects', data: getProducts });
      return;
    }

    try {
      // Buscar en el backend usando tu query de búsqueda
      await fetchProducts({ method: 'post', url: '/api/findObjects', data: searchProducts(query) });
    } catch (error) {
      console.error('Error buscando productos:', error);
      // En caso de error, mantener la búsqueda local
    }
  };

  // Efecto para manejar búsqueda con delay (como en el ejemplo de proveedores)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProductsInBackend(searchQuery);
      } else {
        // Si se borra la búsqueda, volver a cargar todos
        fetchProducts({ method: 'post', url: '/api/findObjects', data: getProducts });
      }
    }, 500); // Delay de 500ms para evitar muchas llamadas

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleToggleFavorite = (productId: string) => {
    setProductosFiltrados(prevProductos => 
      prevProductos.map(producto => 
        producto.id === productId 
          ? { ...producto, favorite: !producto.favorite }
          : producto
      )
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
    setIsRefreshing(true);
    fetchProducts({ method: 'post', url: '/api/findObjects', data: getProducts })
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
            isLoading={loadingProducts}
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