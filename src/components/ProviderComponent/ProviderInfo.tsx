import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProviderInfoProps {
  name: string;
  industry: string;
  address: string;
  tags?: string[];
}

const ProviderInfo: React.FC<ProviderInfoProps> = ({
  name,
  industry,
  address,
  tags = []
}) => {
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