import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Product {
  _id: string;
  name: string;
  description: string;
  image?: string;
  type: string;
  props: {
    price: number;
    images?: string[];
  };
  object_type: [{
    name: string;
  }];
}

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
  onPress?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  variant = 'grid',
  onPress 
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(product);
    } else {
      router.push(`/(index)/(Products)/${product._id}`);
    }
  };

  const getProductImage = () => {
    if (product.props.images && product.props.images.length > 0) {
      return product.props.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryName = () => {
    return product.object_type?.[0]?.name || product.type;
  };

  const productImage = getProductImage();

  if (variant === 'list') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={styles.listCard}
        activeOpacity={0.8}
      >
        <View style={styles.listContent}>
          <View style={styles.listRow}>
            <View style={styles.listImageContainer}>
              {productImage ? (
                <Image
                  source={{ uri: productImage }}
                  style={styles.listImage}
                  resizeMode='cover'
                />
              ) : (
                <View style={styles.listImagePlaceholder}>
                  <MaterialCommunityIcons name="image-off" size={24} color="#9CA3AF" />
                </View>
              )}
            </View>

            <View style={styles.listInfo}>
              <View style={styles.categoryRow}>
                <MaterialCommunityIcons name="tag" size={14} color="#6B7280" />
                <Text style={styles.categoryText}>
                  {getCategoryName()}
                </Text>
              </View>

              <Text style={styles.listProductName} numberOfLines={1}>
                {product.name}
              </Text>
              
              <Text style={styles.listDescription} numberOfLines={2}>
                {product.description}
              </Text>

              <Text style={styles.listPrice}>
                {formatPrice(product.props.price)}
              </Text>
            </View>

            <View style={styles.listChevron}>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.gridCard}
      activeOpacity={0.8}
    >
      <View style={styles.gridImageContainer}>
        {productImage ? (
          <Image
            source={{ uri: productImage }}
            style={styles.gridImage}
            resizeMode='cover'
          />
        ) : (
          <View style={styles.gridImagePlaceholder}>
            <MaterialCommunityIcons name="image-off" size={32} color="#9CA3AF" />
          </View>
        )}
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {getCategoryName()}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <MaterialCommunityIcons name="heart-outline" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContent}>
        <Text style={styles.gridProductName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.gridDescription} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.gridFooter}>
          <Text style={styles.gridPrice} numberOfLines={1}>
            {formatPrice(product.props.price)}
          </Text>
          
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <MaterialCommunityIcons name="cart-plus" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: 'white',
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
  },
  listContent: {
    padding: 16,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    marginRight: 12,
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listInfo: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  listProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  listPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  listChevron: {
    alignSelf: 'center',
    marginLeft: 8,
  },
  gridCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    width: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  gridImageContainer: {
    position: 'relative',
    height: 128,
    backgroundColor: '#F3F4F6',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  gridContent: {
    padding: 12,
  },
  gridProductName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  gridDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  gridFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    flex: 1,
  },
  cartButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default ProductCard;