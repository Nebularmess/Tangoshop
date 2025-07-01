import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Interface para el producto que viene del backend (nueva estructura)
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
}

interface ProductCardProps {
  product: BackendProduct; // Ahora recibe todo el objeto del backend
  onPress: () => void;
  onToggleFavorite: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onToggleFavorite,
}) => {
  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`;
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(product._id);
  };

  // Determinar si está en favoritos
  const isFavorite = product.saved_product && product.saved_product.length > 0;

  // Obtener la imagen principal
  const getImageUri = () => {
    if (product.props?.images && product.props.images.length > 0) {
      return product.props.images[0];
    }
    return '';
  };

  const getRating = () => {
    return 4.5;
  };

  // Formatear fecha de publicación
  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR');
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.contentWrapper}>
        <View style={styles.mainContent}>
          {/* Imagen del producto */}
          <Image 
            source={{ uri: getImageUri() }} 
            style={styles.productImage}
          />

          {/* Información del producto */}
          <View style={styles.infoContainer}>
            {/* Nombre del producto */}
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
            
            {/* Rating y categoría */}
            <View style={styles.ratingCategoryRow}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#2563EB" />
                <Text style={styles.ratingText}>
                  {getRating().toFixed(1)}
                </Text>
              </View>
            </View>
            
            {/* Información adicional */}
            <View style={styles.detailsRow}>
              {/* Columna izquierda: Descripción y tags */}
              <View style={styles.leftColumn}>
                {product.description && (
                  <View style={styles.detailItem}>
                    <Ionicons name="information-circle" size={14} color="#6B7280" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {product.description}
                    </Text>
                  </View>
                )}
                
                {product.tags && product.tags.length > 0 && (
                  <View style={styles.detailItem}>
                    <Ionicons name="pricetag" size={14} color="#6B7280" style={{ marginTop: 1 }} />
                    <Text style={styles.detailText}>
                      {product.tags[0]} {product.tags.length > 1 && `+${product.tags.length - 1}`}
                    </Text>
                  </View>
                )}
              </View>

              {/* Columna derecha: Categoría y Precio */}
              <View style={styles.rightColumn}>
                {product.categorie && (
                  <View style={styles.detailItemRight}>
                    <Ionicons name="apps" size={14} color="#6B7280" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {product.categorie}
                    </Text>
                  </View>
                )}
                
                <View style={styles.detailItemRight}>
                  <Ionicons name="cash" size={14} color="#6B7280" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {formatPrice(product.props?.price || 0)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Fecha de publicación */}
            {product.published && (
              <View style={styles.publishedContainer}>
                <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                <Text style={styles.publishedText}>
                  {formatPublishedDate(product.published)}
                </Text>
              </View>
            )}
          </View>

          {/* Flecha de navegación */}
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>
      </View>

      {/* Icono de favorito */}
      <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={20} 
          color={isFavorite ? "#FF4444" : "#666"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  contentWrapper: {
    padding: 16,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  ratingCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1D4ED8',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
    marginRight: 8,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  publishedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  publishedText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  chevronContainer: {
    alignSelf: 'center',
    marginLeft: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
});

export default ProductCard;