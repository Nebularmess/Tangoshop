import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProviderInfoProps {
  name: string;
  industry: string;
  address: string;
  tags?: string[];
  isLoading?: boolean;
}

const ProviderInfo: React.FC<ProviderInfoProps> = ({
  name,
  industry,
  address,
  tags = [],
  isLoading = false
}) => {
  // Skeleton para texto
  const TextSkeleton: React.FC<{ width?: string; height?: string }> = ({ 
    width = 'w-full', 
    height = 'h-4' 
  }) => (
    <View className={`${width} ${height} bg-gray-300 rounded animate-pulse`} />
  );

  if (isLoading) {
    return (
      <View className='items-center pt-6 pb-4'>
        {/* Nombre del proveedor skeleton */}
        <View className='items-center mb-2'>
          <TextSkeleton width='w-48' height='h-6' />
        </View>
        
        {/* Industria skeleton */}
        <View className='flex-row items-center mb-3'>
          <View className='w-4 h-4 bg-gray-300 rounded animate-pulse' />
          <TextSkeleton width='w-32' height='h-4' />
        </View>
        
        {/* Dirección skeleton */}
        <View className='flex-row items-start mb-4 px-4'>
          <View className='w-4 h-4 bg-gray-300 rounded animate-pulse' />
          <View className='ml-2 flex-1 items-center'>
            <TextSkeleton width='w-40' height='h-4' />
          </View>
        </View>
        
        {/* Tags skeleton */}
        <View className='flex-row flex-wrap justify-center px-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} className='bg-gray-200 px-3 py-1 rounded-full m-1 animate-pulse'>
              <TextSkeleton width='w-12' height='h-3' />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className='items-center pt-6 pb-4'>
      {/* Nombre del proveedor */}
      <Text className='text-2xl font-bold text-gray-900 text-center mb-2'>
        {name}
      </Text>
      
      {/* Industria */}
      <View className='flex-row items-center mb-3'>
        <MaterialCommunityIcons name="briefcase" size={16} color="#2563EB" />
        <Text className='text-base text-blue-600 font-medium ml-2'>
          {industry}
        </Text>
      </View>
      
      {/* Dirección */}
      <View className='flex-row items-start mb-4 px-4'>
        <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
        <Text className='text-sm text-gray-600 ml-2 text-center flex-1'>
          {address}
        </Text>
      </View>
      
      {/* Tags/Etiquetas */}
      {tags.length > 0 && (
        <View className='flex-row flex-wrap justify-center px-4'>
          {tags.slice(0, 4).map((tag, index) => (
            <View key={index} className='bg-gray-100 px-3 py-1 rounded-full m-1'>
              <Text className='text-xs text-gray-700 font-medium'>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ProviderInfo;