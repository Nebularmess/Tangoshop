import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import usefetch from "../../../hooks/useFetch";
import { getProductById } from '../../../utils/queryProduct';

// Interface para el producto del backend (DEBE COINCIDIR con la del index)
interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  type: string;
  categorie: string;
  tags?: string[];
  props: {
    price: number;
    images?: string[];
    [key: string]: any;
  };
  published: string;
  saved_product: {
    _id: string;
  }[]; // Array vacío = no guardado, con elementos = guardado
  object_type?: {
    _id: string;
    name: string;
    parent: string;
  }[];
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

// Obtener dimensiones de la pantalla
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const StarRating: React.FC<{ rating: number; maxStars?: number }> = ({ rating, maxStars = 5 }) => {
    return (
        <View style={styles.starsContainer}>
            {[...Array(maxStars)].map((_, index) => (
                <Ionicons
                    key={index}
                    name={index < rating ? "star" : "star-outline"}
                    size={20}
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
  const [producto, setProducto] = useState<BackendProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);

  // Hook para obtener datos del backend
  const { data: productData, execute: fetchProduct, loading: loadingProduct } = usefetch<ProductApiResponse>();

  // Obtener userData del AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          setUserId(userData._id);
          console.log('✅ Usuario cargado en detalle:', userData._id);
        } else {
          console.log('❌ No hay usuario en AsyncStorage');
          setError('No se pudo obtener información del usuario');
        }
      } catch (error) {
        console.error('❌ Error obteniendo userData:', error);
        setError('Error obteniendo información del usuario');
      }
    };

    getUserData();
  }, []);

  // Cargar producto cuando tenemos userId e id
  useEffect(() => {
    if (userId && id && typeof id === 'string') {
      console.log('🔄 Cargando producto:', id, 'para usuario:', userId);
      fetchProduct({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getProductById(userId, id)
      });
    } else if (!userId) {
      console.log('⏳ Esperando userId...');
    } else {
      console.log('❌ ID de producto inválido:', id);
      setError('ID de producto inválido');
    }
  }, [userId, id]);

  // Efecto para procesar datos cuando llegan del backend
  useEffect(() => {
    if (productData?.items && productData.items.length > 0) {
      console.log('✅ Producto cargado:', productData.items[0]);
      setProducto(productData.items[0]);
      setError(null);
    } else if (productData?.items && productData.items.length === 0) {
      console.log('❌ Producto no encontrado');
      setError('Producto no encontrado');
    } else if (productData?.error) {
      console.log('❌ Error del backend:', productData.error);
      setError('Error al cargar el producto');
    }
  }, [productData]);

  // Manejar toggle de favorito
  const handleToggleFavorite = () => {
    if (producto) {
      setProducto(prev => 
        prev ? { 
          ...prev, 
          saved_product: prev.saved_product.length > 0 ? [] : [{ _id: 'temp' }]
        } : null
      );
      
      // Aquí implementarías la llamada al backend para guardar/quitar favoritos
      const isFavorite = producto.saved_product.length > 0;
      console.log(isFavorite ? '🗑️ Quitando de favoritos' : '❤️ Agregando a favoritos', producto._id);
    }
  };

  // Función para obtener la imagen principal
  const getImageUri = () => {
    if (producto?.props?.images && producto.props.images.length > 0) {
      return producto.props.images[0];
    }
    return '';
  };

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`;
  };

  // Función para calcular rating (por defecto)
  const getRating = () => {
    return 4.5; // Ajusta según tu lógica
  };

  // Función para formatear fecha
  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR');
    } catch {
      return '';
    }
  };

  // Funciones para el modal de imágenes
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!producto?.props?.images || selectedImageIndex === null) return;
    
    const totalImages = producto.props.images.length;
    let newIndex = selectedImageIndex;
    
    if (direction === 'next') {
      newIndex = (selectedImageIndex + 1) % totalImages;
    } else {
      newIndex = selectedImageIndex === 0 ? totalImages - 1 : selectedImageIndex - 1;
    }
    
    setSelectedImageIndex(newIndex);
  };

  // Determinar si está en favoritos
  const isFavorite = producto?.saved_product && producto.saved_product.length > 0;

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
          if (userId && id && typeof id === 'string') {
            fetchProduct({ 
              method: 'post', 
              url: '/api/findObjects', 
              data: getProductById(userId, id)
            });
          }
        }}
      >
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  // Si está cargando o no tenemos userId
  if (loadingProduct || !userId) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingComponent />
      </SafeAreaView>
    );
  }

  // Si hay error
  if (error || !producto) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorComponent />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header con imagen de fondo - similar al de proveedores */}
        <View style={styles.headerContainer}>
          <Image
            source={{ 
              uri: getImageUri() || 'https://via.placeholder.com/400x250/2563EB/ffffff?text=Producto'
            }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay} />
          
          {/* Botones de navegación */}
          <View style={styles.headerButtons}>
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
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#FF4444" : "white"} 
              />
            </TouchableOpacity>
          </View>

          {/* Logo/Imagen circular del producto */}
          <TouchableOpacity 
            style={styles.logoContainer}
            onPress={() => {
              console.log('🖼️ Tocando logo del producto');
              openImageModal(0);
            }}
            activeOpacity={0.8}
          >
            <Image
              source={{ 
                uri: getImageUri() || 'https://via.placeholder.com/100x100/F3F4F6/6B7280?text=P'
              }}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Contenedor principal con bordes redondeados */}
        <View style={styles.mainContainer}>
          {/* Información básica del producto */}
          <View style={styles.productInfoContainer}>
            <Text style={styles.productTitle}>{producto.name}</Text>
            
            {/* Precio */}
            <View style={styles.priceContainer}>
              <Ionicons name="cash-outline" size={20} color="#2563EB" />
              <Text style={styles.price}>
                {formatPrice(producto.props?.price || 0)}
              </Text>
            </View>

            {/* Categoría */}
            <View style={styles.categoryContainer}>
              <Ionicons name="pricetag-outline" size={16} color="#2563EB" />
              <Text style={styles.categoryText}>{producto.categorie}</Text>
            </View>

            {/* Calificación */}
            <View style={styles.ratingContainer}>
              <StarRating rating={Math.round(getRating())} />
              <Text style={styles.ratingText}>{getRating().toFixed(1)}</Text>
            </View>

            {/* Tags si los hay */}
            {producto.tags && producto.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {producto.tags.slice(0, 4).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Descripción del producto */}
        {producto.description && (
          <View style={styles.cardContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.descriptionText}>{producto.description}</Text>
            </View>
          </View>
        )}

        {/* Imágenes adicionales si las hay */}
        {producto.props?.images && producto.props.images.length > 1 && (
          <View style={styles.cardContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="images-outline" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>Más imágenes</Text>
            </View>
            <View style={styles.sectionContent}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScrollView}>
                {producto.props.images.slice(1).map((imageUri, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      console.log('🖼️ Tocando imagen adicional, índice:', index + 1);
                      openImageModal(index + 1);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.additionalImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Información adicional */}
        <View style={styles.cardContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Información adicional</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoría:</Text>
              <Text style={styles.infoValue}>{producto.categorie}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID del producto:</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{producto._id}</Text>
            </View>
            {producto.published && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha de publicación:</Text>
                <Text style={styles.infoValue}>{formatPublishedDate(producto.published)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Espaciado inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Modal para mostrar imágenes en grande */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalOverlay}>
          <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.9)" />
          
          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={closeImageModal}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            
            {producto?.props?.images && (
              <Text style={styles.modalImageCounter}>
                {(selectedImageIndex || 0) + 1} de {producto.props.images.length}
              </Text>
            )}
          </View>

          {/* Contenedor de la imagen */}
          <View style={styles.modalImageContainer}>
            {producto?.props?.images && selectedImageIndex !== null && (
              <TouchableOpacity
                style={styles.modalImageWrapper}
                activeOpacity={1}
                onPress={() => {/* Evitar cerrar al tocar la imagen */}}
              >
                <Image
                  source={{ uri: producto.props.images[selectedImageIndex] }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {/* Botones de navegación si hay más de una imagen */}
            {producto?.props?.images && producto.props.images.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalNavButtonLeft]}
                  onPress={() => navigateImage('prev')}
                >
                  <Ionicons name="chevron-back" size={32} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalNavButtonRight]}
                  onPress={() => navigateImage('next')}
                >
                  <Ionicons name="chevron-forward" size={32} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Indicadores de imagen si hay más de una */}
          {producto?.props?.images && producto.props.images.length > 1 && (
            <View style={styles.modalIndicators}>
              {producto.props.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalIndicator,
                    selectedImageIndex === index && styles.modalIndicatorActive
                  ]}
                  onPress={() => setSelectedImageIndex(index)}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
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
  // Nuevos estilos siguiendo el patrón del proveedor
  headerContainer: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
    zIndex: 2,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
  },
  mainContainer: {
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productInfoContainer: {
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
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
    marginHorizontal: 1,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
  },
  imagesScrollView: {
    flexDirection: 'row',
  },
  additionalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  // Estilos para el modal de imágenes
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageCounter: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalImageWrapper: {
    width: screenWidth,
    height: screenHeight * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
  modalNavButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
  },
  modalNavButtonLeft: {
    left: 20,
  },
  modalNavButtonRight: {
    right: 20,
  },
  modalIndicators: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  modalIndicatorActive: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});