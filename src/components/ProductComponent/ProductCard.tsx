import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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
      // Navegar a pantalla de detalle del producto
      router.push(`/(index)/(Products)/${product._id}`);
    }
  };

  // Obtener la imagen a mostrar (prioridad: props.images[0] > image)
  const getProductImage = () => {
    if (product.props.images && product.props.images.length > 0) {
      return product.props.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return null;
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Obtener nombre de categoría
  const getCategoryName = () => {
    return product.object_type?.[0]?.name || product.type;
  };

  const productImage = getProductImage();

  if (variant === 'list') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className='bg-white rounded-lg mx-2 mb-3 border border-gray-200'
        activeOpacity={0.8}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View className='p-4'>
          <View className='flex-row items-start space-x-3'>
            {/* Imagen del producto */}
            <View className='w-16 h-16 rounded-lg bg-gray-100 overflow-hidden'>
              {productImage ? (
                <Image
                  source={{ uri: productImage }}
                  className='w-full h-full'
                  resizeMode='cover'
                />
              ) : (
                <View className='w-full h-full bg-gray-200 items-center justify-center'>
                  <MaterialCommunityIcons name="image-off" size={24} color="#9CA3AF" />
                </View>
              )}
            </View>

            {/* Información del producto */}
            <View className='flex-1'>
              {/* Categoría */}
              <View className='flex-row items-center mb-1'>
                <MaterialCommunityIcons name="tag" size={14} color="#6B7280" />
                <Text className='text-xs text-gray-500 ml-1 uppercase font-medium'>
                  {getCategoryName()}
                </Text>
              </View>

              {/* Nombre del producto */}
              <Text className='text-base font-bold text-gray-900 mb-1' numberOfLines={1}>
                {product.name}
              </Text>
              
              {/* Descripción */}
              <Text className='text-sm text-gray-600 mb-2' numberOfLines={2}>
                {product.description}
              </Text>

              {/* Precio */}
              <Text className='text-lg font-bold text-green-600'>
                {formatPrice(product.props.price)}
              </Text>
            </View>

            {/* Flecha de navegación */}
            <View className='self-center ml-2'>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Variant grid (por defecto)
  return (
    <TouchableOpacity
      onPress={handlePress}
      className='bg-white rounded-xl mr-3 mb-3 border border-gray-200 overflow-hidden'
      activeOpacity={0.8}
      style={{
        width: 180,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      {/* Imagen del producto */}
      <View className='relative h-32 bg-gray-100'>
        {productImage ? (
          <Image
            source={{ uri: productImage }}
            className='w-full h-full'
            resizeMode='cover'
          />
        ) : (
          <View className='w-full h-full bg-gray-200 items-center justify-center'>
            <MaterialCommunityIcons name="image-off" size={32} color="#9CA3AF" />
          </View>
        )}
        
        {/* Badge de categoría */}
        <View className='absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1'>
          <Text className='text-xs font-medium text-gray-700'>
            {getCategoryName()}
          </Text>
        </View>

        {/* Icono de favorito (placeholder) */}
        <TouchableOpacity 
          className='absolute top-2 right-2 bg-white/90 rounded-full p-1'
          onPress={(e) => {
            e.stopPropagation();
            // Lógica de favoritos aquí
          }}
        >
          <MaterialCommunityIcons name="heart-outline" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View className='p-3'>
        {/* Nombre del producto */}
        <Text className='text-sm font-bold text-gray-900 mb-1' numberOfLines={2}>
          {product.name}
        </Text>
        
        {/* Descripción */}
        <Text className='text-xs text-gray-600 mb-3' numberOfLines={2}>
          {product.description}
        </Text>

        {/* Precio y botón */}
        <View className='flex-row items-center justify-between'>
          <Text className='text-base font-bold text-green-600' numberOfLines={1}>
            {formatPrice(product.props.price)}
          </Text>
          
          <TouchableOpacity 
            className='bg-blue-600 rounded-lg px-2 py-1'
            onPress={(e) => {
              e.stopPropagation();
              // Lógica de agregar al carrito aquí
            }}
          >
            <MaterialCommunityIcons name="cart-plus" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;