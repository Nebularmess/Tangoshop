import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Provider {
  _id: string;
  name: string;
  description?: string; // Opcional
  image: string;
  tags: string[];
  props: {
    legal_name?: string; // Opcional
    cuit?: string;
    industry?: string; // Opcional  
    tax_address?: string; // Opcional
    phone_number?: string;
    email?: string;
  };
}

interface ProviderCardProps {
  provider: Provider;
  variant?: 'horizontal' | 'vertical';
  onPress?: (provider: Provider) => void;
  isLoading?: boolean; // Nueva prop para manejar el estado de carga
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  provider, 
  variant = 'horizontal',
  onPress,
  isLoading = false // Por defecto no está cargando
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (isLoading) return; // No permite clicks durante la carga
    
    if (onPress) {
      onPress(provider);
    } else {
      router.push(`/(index)/(Providers)/${provider._id}`);
    }
  };

  // Función para extraer ciudad y provincia de la dirección
  const parseAddress = (address: string) => {
    const parts = address.split(' - ');
    if (parts.length >= 3) {
      const street = parts[0];
      const city = parts[1];
      const province = parts[2];
      return { street, city, province };
    }
    return { street: address, city: '', province: '' };
  };

  const { street, city, province } = parseAddress(provider.props.tax_address || "");

  // Componente para el skeleton/placeholder de texto
  const TextSkeleton: React.FC<{ width?: string; height?: string }> = ({ 
    width = 'w-full', 
    height = 'h-3' 
  }) => (
    <View className={`${width} ${height} bg-gray-300 rounded animate-pulse`} />
  );

  // Componente para el skeleton/placeholder de imagen
  const ImageSkeleton: React.FC<{ className: string }> = ({ className }) => (
    <View className={`${className} bg-gray-300 animate-pulse flex items-center justify-center`}>
      <MaterialCommunityIcons name="image" size={24} color="#9CA3AF" />
    </View>
  );

  if (variant === 'vertical') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className='bg-white rounded-lg mx-2 mb-3 border border-gray-200'
        activeOpacity={isLoading ? 1 : 0.8} // No efecto cuando está cargando
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
        <View className='p-3'>
          <View className='flex-row items-start space-x-4'>
            {/* Logo del proveedor */}
            {isLoading ? (
              <ImageSkeleton className='w-24 h-24 rounded-lg mr-1.5 self-center' />
            ) : (
              <Image
                source={{ uri: provider.image }}
                className='w-24 h-24 rounded-lg bg-gray-100 mr-1.5 self-center'
                resizeMode='cover'
              />
            )}

            {/* Información del proveedor */}
            <View className='flex-1 pr-2'>
              {/* Nombre del proveedor */}
              {isLoading ? (
                <TextSkeleton width='w-3/4' height='h-4' />
              ) : (
                <Text className='text-base font-bold text-gray-900 mb-1' numberOfLines={1}>
                  {provider.name}
                </Text>
              )}
              
              {/* Industria con ícono */}
              <View className='flex-row items-center mb-3 mt-1'>
                {isLoading ? (
                  <>
                    <View className='w-3.5 h-3.5 bg-gray-300 rounded animate-pulse' />
                    <TextSkeleton width='w-1/2' height='h-3' />
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons name="briefcase" size={14} color="#2563EB" />
                    <Text className='text-sm text-blue-600 font-medium ml-2' numberOfLines={1}>
                      {provider.props.industry || 'Sin industria'}
                    </Text>
                  </>
                )}
              </View>

              {/* Información de contacto y ubicación */}
              <View className='space-y-1.5'>
                {/* Teléfono */}
                <View className='flex-row items-center'>
                  {isLoading ? (
                    <>
                      <View className='w-3 h-3 bg-gray-300 rounded animate-pulse' />
                      <TextSkeleton width='w-2/3' height='h-3' />
                    </>
                  ) : (
                    provider.props.phone_number && (
                      <>
                        <MaterialCommunityIcons name="phone" size={12} color="#6B7280" />
                        <Text className='text-xs text-gray-600 ml-2 flex-1' numberOfLines={1}>
                          {provider.props.phone_number}
                        </Text>
                      </>
                    )
                  )}
                </View>
                
                {/* Email */}
                <View className='flex-row items-center'>
                  {isLoading ? (
                    <>
                      <View className='w-3 h-3 bg-gray-300 rounded animate-pulse' />
                      <TextSkeleton width='w-3/4' height='h-3' />
                    </>
                  ) : (
                    provider.props.email && (
                      <>
                        <MaterialCommunityIcons name="email" size={12} color="#6B7280" />
                        <Text className='text-xs text-gray-600 ml-2 flex-1' numberOfLines={1}>
                          {provider.props.email}
                        </Text>
                      </>
                    )
                  )}
                </View>

                {/* Ciudad y Provincia */}
                <View className='flex-row items-center'>
                  {isLoading ? (
                    <>
                      <View className='w-3 h-3 bg-gray-300 rounded animate-pulse' />
                      <TextSkeleton width='w-1/2' height='h-3' />
                    </>
                  ) : (
                    (city || province) && (
                      <>
                        <MaterialCommunityIcons name="map-marker" size={12} color="#6B7280" />
                        <Text className='text-xs text-gray-600 ml-2 flex-1' numberOfLines={1}>
                          {city}{city && province ? ', ' : ''}{province}
                        </Text>
                      </>
                    )
                  )}
                </View>

                {/* Dirección (calle) */}
                <View className='flex-row items-center'>
                  {isLoading ? (
                    <>
                      <View className='w-3 h-3 bg-gray-300 rounded animate-pulse' />
                      <TextSkeleton width='w-4/5' height='h-3' />
                    </>
                  ) : (
                    street && (
                      <>
                        <MaterialCommunityIcons name="home" size={12} color="#6B7280" />
                        <Text className='text-xs text-gray-600 ml-2 flex-1' numberOfLines={1}>
                          {street}
                        </Text>
                      </>
                    )
                  )}
                </View>
              </View>
            </View>

            {/* Flecha de navegación */}
            <View className='self-center'>
              {isLoading ? (
                <View className='w-4 h-4 bg-gray-300 rounded animate-pulse' />
              ) : (
                <MaterialCommunityIcons name="chevron-right" size={18} color="#9CA3AF" />
              )}
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
      activeOpacity={isLoading ? 1 : 0.8}
    >
      {/* Header con imagen */}
      <View className='relative'>
        {isLoading ? (
          <ImageSkeleton className='w-full h-40' />
        ) : (
          <Image
            source={{ uri: provider.image }}
            className='w-full h-40 bg-gray-100'
            resizeMode='cover'
          />
        )}
        
        {/* Overlay gradient y badge - solo si no está cargando */}
        {!isLoading && (
          <>
            <View className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
            <View className='absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex-row items-center'>
              <MaterialCommunityIcons name="store" size={12} color="#2563EB" />
              <Text className='text-xs font-medium text-blue-600 ml-1'>Comercio</Text>
            </View>
          </>
        )}

        {/* Badge skeleton cuando está cargando */}
        {isLoading && (
          <View className='absolute top-2 right-2 bg-gray-300 rounded-full px-2 py-1 animate-pulse'>
            <TextSkeleton width='w-12' height='h-3' />
          </View>
        )}
      </View>

      {/* Contenido */}
      <View className='p-3'>
        {/* Nombre */}
        {isLoading ? (
          <TextSkeleton width='w-3/4' height='h-5' />
        ) : (
          <Text className='text-lg font-bold text-gray-900 mb-2' numberOfLines={1}>
            {provider.name}
          </Text>
        )}
        
        {/* Industria */}
        <View className='flex-row items-center mb-2 mt-2'>
          {isLoading ? (
            <View className='bg-gray-300 px-2 py-1 rounded-full animate-pulse'>
              <TextSkeleton width='w-16' height='h-3' />
            </View>
          ) : (
            <View className='bg-blue-100 px-2 py-1 rounded-full flex-row items-center'>
              <MaterialCommunityIcons name="briefcase-outline" size={12} color="#2563EB" />
              <Text className='text-xs font-medium text-blue-700 ml-1' numberOfLines={1}>
                {provider.props.industry || 'Sin industria'}
              </Text>
            </View>
          )}
        </View>

        {/* Información de contacto y ubicación */}
        <View className='space-y-1 mb-2'>
          {/* Teléfono */}
          <View className='flex-row items-center'>
            {isLoading ? (
              <>
                <View className='w-2.5 h-2.5 bg-gray-300 rounded animate-pulse' />
                <TextSkeleton width='w-2/3' height='h-3' />
              </>
            ) : (
              provider.props.phone_number && (
                <>
                  <MaterialCommunityIcons name="phone" size={10} color="#6B7280" />
                  <Text className='text-xs text-gray-600 ml-1 flex-1' numberOfLines={1}>
                    {provider.props.phone_number}
                  </Text>
                </>
              )
            )}
          </View>
          
          {/* Email */}
          <View className='flex-row items-center'>
            {isLoading ? (
              <>
                <View className='w-2.5 h-2.5 bg-gray-300 rounded animate-pulse' />
                <TextSkeleton width='w-3/4' height='h-3' />
              </>
            ) : (
              provider.props.email && (
                <>
                  <MaterialCommunityIcons name="email" size={10} color="#6B7280" />
                  <Text className='text-xs text-gray-600 ml-1 flex-1' numberOfLines={1}>
                    {provider.props.email}
                  </Text>
                </>
              )
            )}
          </View>

          {/* Ciudad y Provincia */}
          <View className='flex-row items-center'>
            {isLoading ? (
              <>
                <View className='w-2.5 h-2.5 bg-gray-300 rounded animate-pulse' />
                <TextSkeleton width='w-1/2' height='h-3' />
              </>
            ) : (
              (city || province) && (
                <>
                  <MaterialCommunityIcons name="map-marker" size={10} color="#6B7280" />
                  <Text className='text-xs text-gray-600 ml-1 flex-1' numberOfLines={1}>
                    {city}{city && province ? ', ' : ''}{province}
                  </Text>
                </>
              )
            )}
          </View>

          {/* Dirección (calle) */}
          <View className='flex-row items-center'>
            {isLoading ? (
              <>
                <View className='w-2.5 h-2.5 bg-gray-300 rounded animate-pulse' />
                <TextSkeleton width='w-4/5' height='h-3' />
              </>
            ) : (
              street && (
                <>
                  <MaterialCommunityIcons name="home" size={10} color="#6B7280" />
                  <Text className='text-xs text-gray-600 ml-1 flex-1' numberOfLines={1}>
                    {street}
                  </Text>
                </>
              )
            )}
          </View>
        </View>

        {/* Footer */}
        <View className='flex-row items-center justify-end border-t border-gray-100 pt-2'>
          {isLoading ? (
            <View className='w-3.5 h-3.5 bg-gray-300 rounded animate-pulse' />
          ) : (
            <MaterialCommunityIcons name="chevron-right" size={14} color="#9CA3AF" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProviderCard;