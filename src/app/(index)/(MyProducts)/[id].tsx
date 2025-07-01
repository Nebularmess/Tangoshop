import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import usefetch from "../../../hooks/useFetch";
import { getProductById } from '../../../utils/queryProduct'; // Tu archivo de queries

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

// Interface para la respuesta de la API
interface ProductApiResponse {
  path: string;
  method: string;
  error?: any;
  items: BackendProduct[];
}

// Interface para la UI
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
  // Campos adicionales del backend
  images?: string[];
  tags?: string[];
  owner?: string;
  props?: any;
}

// Función para transformar datos del backend
const transformProduct = (backendProduct: BackendProduct): Producto => {
  return {
    id: backendProduct._id,
    imageUri: backendProduct.image || backendProduct.props?.images?.[0] || '',
    name: backendProduct.name,
    rating: 4.5, // Por defecto
    category: backendProduct.object_type?.[0]?.name || 'Sin categoría',
    subcategory: backendProduct.object_type?.[0]?.name || 'Sin categoría',
    description: backendProduct.description,
    price: backendProduct.props?.price || 0,
    favorite: false, // Esto lo manejas localmente
    // Campos adicionales
    images: backendProduct.props?.images,
    tags: backendProduct.tags,
    owner: backendProduct.owner,
    props: backendProduct.props,
  };
};

// Componente para las estrellas de calificación
const StarRating: React.FC<{ rating: number; maxStars?: number }> = ({ rating, maxStars = 5 }) => {
    return (
        <View style={styles.starsContainer}>
            {[...Array(maxStars)].map((_, index) => (
                <Ionicons
                    key={index}
                    name={index < rating ? "star" : "star-outline"}
                    size={24}
                    color={index < rating ? "#2563EB" : "#D1D5DB"}
                    style={styles.star}
                />
            ))}
        </View>
    );
};

export default function ProductoDetalle() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Estados
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hook para obtener datos del backend (igual que en index)
  const { data: productData, execute: fetchProduct, loading: loadingProduct } = usefetch<ProductApiResponse>();

  // Cargar producto al montar el componente
  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchProduct({ method: 'post', url: '/api/findObjects', data: getProductById(id) });
    } else {
      setError('ID de producto inválido');
    }
  }, [id]);

  // Efecto para procesar datos cuando llegan del backend
  useEffect(() => {
    if (productData?.items && productData.items.length > 0) {
      const transformedProduct = transformProduct(productData.items[0]);
      setProducto(transformedProduct);
      setError(null);
    } else if (productData?.items && productData.items.length === 0) {
      setError('Producto no encontrado');
    } else if (productData?.error) {
      setError('Error al cargar el producto');
    }
  }, [productData]);

  // Manejar toggle de favorito
  const handleToggleFavorite = () => {
    if (producto) {
      setProducto(prev => prev ? { ...prev, favorite: !prev.favorite } : null);
    }
  };

  // Componente de Loading
  const LoadingComponent = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.loadingText}>Cargando producto...</Text>
    </View>
  );

  // Componente de Error
  const ErrorComponent = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color="#E53E3E" />
      <Text style={styles.errorTitle}>Error al cargar producto</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={() => {
          if (id && typeof id === 'string') {
            fetchProduct({ method: 'post', url: '/api/findObjects', data: getProductById(id) });
          }
        }}
      >
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  // Si está cargando
  if (loadingProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <LoadingComponent />
      </SafeAreaView>
    );
  }

  // Si hay error
  if (error || !producto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ErrorComponent />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons 
            name={producto.favorite ? "heart" : "heart-outline"} 
            size={24} 
            color={producto.favorite ? "#FF4444" : "white"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Contenedor principal del producto */}
        <View style={styles.productCard}>
          {/* Imagen del producto */}
          <View style={styles.imageContainer}>
            <Image
              source={{ 
                uri: producto.imageUri || 'https://via.placeholder.com/200x300/F3F4F6/6B7280?text=Producto'
              }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>

          {/* Información del producto */}
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{producto.name}</Text>
            
            {/* Calificación */}
            <View style={styles.ratingContainer}>
              <StarRating rating={Math.round(producto.rating)} />
              <Text style={styles.ratingText}>{producto.rating.toFixed(1)}</Text>
            </View>

            {/* Precio */}
            <Text style={styles.price}>
              ${producto.price.toLocaleString('es-AR')}
            </Text>

            {/* Categoría */}
            <View style={styles.categoryContainer}>
              <Ionicons name="pricetag-outline" size={16} color="#6B7280" />
              <Text style={styles.categoryText}>{producto.category}</Text>
            </View>

            {/* Tags si los hay */}
            {producto.tags && producto.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsTitle}>Etiquetas:</Text>
                <View style={styles.tagsRow}>
                  {producto.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Botón de catálogo completo */}
            <TouchableOpacity style={styles.catalogButton}>
              <Text style={styles.catalogButtonText}>Catálogo completo</Text>
              <Ionicons name="create-outline" size={20} color="white" style={styles.catalogIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Descripción del producto */}
        {producto.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>{producto.description}</Text>
          </View>
        )}

        {/* Imágenes adicionales si las hay */}
        {producto.images && producto.images.length > 1 && (
          <View style={styles.additionalImagesContainer}>
            <Text style={styles.additionalImagesTitle}>Más imágenes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.additionalImagesScroll}>
              {producto.images.slice(1).map((imageUri, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={styles.additionalImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Información adicional */}
        <View style={styles.additionalInfoContainer}>
          <Text style={styles.additionalInfoTitle}>Información adicional</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoría:</Text>
            <Text style={styles.infoValue}>{producto.category}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID del producto:</Text>
            <Text style={styles.infoValue}>{producto.id}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E40AF',
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53E3E',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  productCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: '#2563EB',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productImage: {
    width: 200,
    height: 200,
  },
  productInfo: {
    padding: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  tagText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '500',
  },
  catalogButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  catalogButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  catalogIcon: {
    marginLeft: 4,
  },
  descriptionContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
  },
  additionalImagesContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  additionalImagesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  additionalImagesScroll: {
    flexDirection: 'row',
  },
  additionalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  additionalInfoContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  additionalInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
});