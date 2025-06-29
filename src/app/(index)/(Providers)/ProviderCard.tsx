import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Provider {
  _id: string;
  name: string;
  image: string;
  tags: string[];
  props: {
    legal_name: string;
    industry: string;
    tax_address: string;
  };
}

interface ProviderCardProps {
  provider: Provider;
  variant?: 'horizontal' | 'vertical';
  onPress?: (provider: Provider) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  provider, 
  variant = 'horizontal',
  onPress 
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(provider);
    } else {
      // TODO: Crear ruta de detalle del proveedor
      console.log('Proveedor seleccionado:', provider.name);
      // router.push(`/provider/${provider._id}`);
    }
  };

  if (variant === 'vertical') {
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
            {/* Logo del proveedor - más pequeño */}
            <Image
              source={{ uri: provider.image }}
              className='w-12 h-12 rounded-lg bg-gray-100'
              resizeMode='cover'
            />

            {/* Información del proveedor */}
            <View className='flex-1'>
              {/* Nombre del proveedor */}
              <Text className='text-base font-bold text-gray-900 mb-1' numberOfLines={1}>
                {provider.name}
              </Text>
              
              {/* Industria con ícono */}
              <View className='flex-row items-center mb-2'>
                <MaterialCommunityIcons name="briefcase" size={16} color="#2563EB" />
                <Text className='text-sm text-blue-600 font-medium ml-2' numberOfLines={1}>
                  {provider.props.industry}
                </Text>
              </View>
              
              {/* Dirección con ícono */}
              <View className='flex-row items-start mb-2'>
                <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
                <Text className='text-sm text-gray-600 ml-2 flex-1' numberOfLines={1}>
                  {provider.props.tax_address}
                </Text>
              </View>

              {/* Solo dirección - sin información adicional */}
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

  // Variant horizontal
  return (
    <TouchableOpacity
      onPress={handlePress}
      className='bg-white rounded-xl mr-3 border border-gray-100 shadow-sm overflow-hidden'
      style={{ width: 280 }}
      activeOpacity={0.8}
    >
      {/* Header con imagen */}
      <View className='relative'>
        <Image
          source={{ uri: provider.image }}
          className='w-full h-32 bg-gray-100'
          resizeMode='cover'
        />
        {/* Overlay gradient */}
        <View className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
        
        {/* Badge de comercio */}
        <View className='absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex-row items-center'>
          <MaterialCommunityIcons name="store" size={12} color="#2563EB" />
          <Text className='text-xs font-medium text-blue-600 ml-1'>Comercio</Text>
        </View>
      </View>

      {/* Contenido */}
      <View className='p-4'>
        {/* Nombre */}
        <Text className='text-lg font-bold text-gray-900 mb-2' numberOfLines={1}>
          {provider.name}
        </Text>
        
        {/* Industria */}
        <View className='flex-row items-center mb-3'>
          <View className='bg-blue-100 px-3 py-1 rounded-full flex-row items-center'>
            <MaterialCommunityIcons name="briefcase-outline" size={12} color="#2563EB" />
            <Text className='text-xs font-medium text-blue-700 ml-1' numberOfLines={1}>
              {provider.props.industry}
            </Text>
          </View>
        </View>
        
        {/* Dirección */}
        <View className='flex-row items-start mb-3'>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color="#6B7280" />
          <Text className='text-sm text-gray-600 ml-1 flex-1 leading-5' numberOfLines={2}>
            {provider.props.tax_address}
          </Text>
        </View>

        {/* Footer simple */}
        <View className='flex-row items-center justify-end border-t border-gray-100 pt-3'>
          <MaterialCommunityIcons name="chevron-right" size={16} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProviderCard;