import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  id: number;
  imageUri: string;
  name: string;
  rating: number;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  onPress: () => void;
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
  onPress,
}) => {
  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {/* Imagen del producto */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.productImage} />
      </View>

      {/* Contenido del producto */}
      <View style={styles.contentContainer}>
        {/* Rating y categoría */}
        <View style={styles.topSection}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        {/* Nombre del producto */}
        <Text style={styles.productName}>{name}</Text>

        {/* Descripción y subcategoría */}
        <Text style={styles.productDescription}>
          {description} {subcategory}
        </Text>

        {/* Precio */}
        <Text style={styles.priceText}>{formatPrice(price)}</Text>
      </View>

      {/* Icono de favorito */}
      <TouchableOpacity style={styles.favoriteButton} onPress={() => console.log('Favorito:', name)}>
        <Ionicons name="heart-outline" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  imageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
    lineHeight: 20,
  },
  productDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
});

export default ProductCard;