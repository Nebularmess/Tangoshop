import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ProviderHeaderProps {
  backgroundImage: string;
  logoImage: string;
  providerName: string;
  height?: number;
}

const { width } = Dimensions.get('window');

const ProviderHeader: React.FC<ProviderHeaderProps> = ({
  backgroundImage,
  logoImage,
  providerName,
  height = 250
}) => {
  const router = useRouter();

  return (
    <View className='relative overflow-hidden rounded-t-2xl' style={{ height }}>
      {/* Imagen de fondo */}
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
      
      {/* Botón de compartir */}
      <TouchableOpacity
        className='absolute top-12 right-4 bg-white/90 rounded-full p-2'
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="share-variant" size={24} color="#374151" />
      </TouchableOpacity>
      
      {/* Logo del proveedor centrado */}
      <View className='absolute bottom-6 left-1/2 transform -translate-x-1/2' style={{ marginLeft: -40 }}>
        <View className='bg-white p-2 rounded-2xl border-4 border-white'>
          <Image
            source={{ uri: logoImage }}
            className='w-20 h-20 rounded-xl'
            resizeMode='cover'
          />
        </View>
      </View>
    </View>
  );
};

export default ProviderHeader;