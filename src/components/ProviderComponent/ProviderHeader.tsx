
import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ProviderHeaderProps {
  backgroundImage: string;
  logoImage: string;
  providerName: string;
  height?: number;
  isLoading?: boolean;
}

const { width } = Dimensions.get('window');

const ProviderHeader: React.FC<ProviderHeaderProps> = ({
  backgroundImage,
  logoImage,
  providerName,
  height = 250,
  isLoading = false
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <View className='relative' style={{ height }}>
        {/* Skeleton de imagen de fondo */}
        <View className='absolute inset-0 w-full h-full bg-gray-300 animate-pulse' />
        
        {/* Skeleton de botones */}
        <View className='absolute top-12 left-4 w-10 h-10 bg-gray-400 rounded-full animate-pulse' />
        <View className='absolute top-12 right-4 w-10 h-10 bg-gray-400 rounded-full animate-pulse' />
        
        {/* Skeleton del logo del proveedor */}
        <View 
          className='absolute left-6 bg-white p-2 rounded-2xl border-4 border-white'
          style={{ 
            bottom: -40,
            zIndex: 1000,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 10,
          }}
        >
          <View className='w-20 h-20 bg-gray-300 rounded-xl animate-pulse' />
        </View>
      </View>
    );
  }

  return (
    <View className='relative' style={{ height }}>
      {/* Imagen de fondo - cubre totalmente, sin contenedor */}
      <Image
        source={{ uri: backgroundImage }}
        className='absolute inset-0 w-full h-full'
        resizeMode='cover'
      />
      
      {/* Overlay oscuro */}
      <View className='absolute inset-0 bg-black/30' />
      
      {/* Botón de retroceso */}
      <TouchableOpacity
        onPress={() => router.back()}
        className='absolute top-12 left-4 bg-white/90 rounded-full p-2'
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
      </TouchableOpacity>
      
      {/* Logo del proveedor*/}
      <View 
        className='absolute left-6 bg-white p-2 rounded-2xl border-4 border-white'
        style={{ 
          bottom: -40, // Se extiende hacia el cuerpo
          zIndex: 1000, // Z-index alto para que esté encima
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 10, // Elevación alta para Android
        }}
      >
        <Image
          source={{ uri: logoImage }}
          className='w-20 h-20 rounded-xl'
          resizeMode='cover'
        />
      </View>
    </View>
  );
};

export default ProviderHeader;