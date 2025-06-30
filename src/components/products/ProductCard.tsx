import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  id: string;
  imageUri: string;
  name: string;
  rating: number;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  favorite?: boolean;
  onPress: () => void;
  onToggleFavorite: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUri,
  name,
  rating,
  category,
  subcategory,
  description,
  price,
  favorite,
  onPress,
  onToggleFavorite,
}) => {
  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`;
  };
  const handleToggleFavorite = () => {
    onToggleFavorite(id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.contentWrapper}>
        <View style={styles.mainContent}>
          {/* Imagen del producto */}
          <Image source={{ uri: imageUri }} style={styles.productImage} />

          {/* Información del producto */}
          <View style={styles.infoContainer}>
            {/* Nombre del producto */}
            <Text style={styles.productName} numberOfLines={1}>
              {name}
            </Text>
            
            {/* Rating y categoría */}
            <View style={styles.ratingCategoryRow}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#2563EB" />
                <Text style={styles.ratingText}>
                  {rating.toFixed(1)}
                </Text>
              </View>
            </View>
            
            {/* Información adicional */}
            <View style={styles.detailsRow}>
              {/* Columna izquierda: Descripción y subcategoría */}
              <View style={styles.leftColumn}>
                {description && (
                  <View style={styles.detailItem}>
                    <Ionicons name="information-circle" size={14} color="#6B7280" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {description}
                    </Text>
                  </View>
                )}
                
                {subcategory && (
                  <View style={styles.detailItem}>
                    <Ionicons name="pricetag" size={14} color="#6B7280" style={{ marginTop: 1 }} />
                    <Text style={styles.detailText}>
                      {subcategory}
                    </Text>
                  </View>
                )}
              </View>

              {/* Columna derecha: Categoría y Precio */}
              <View style={styles.rightColumn}>
                {category && (
                  <View style={styles.detailItemRight}>
                    <Ionicons name="apps" size={14} color="#6B7280" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {category}
                    </Text>
                  </View>
                )}
                
                <View style={styles.detailItemRight}>
                  <Ionicons name="cash" size={14} color="#6B7280" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {formatPrice(price)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Flecha de navegación */}
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>
      </View>

      {/* Icono de favorito */}
      <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
        <Ionicons name={favorite ? "heart" : "heart-outline"} size={20} color={favorite ? "#FF4444" : "#666"} />
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