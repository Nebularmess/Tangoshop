import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DescriptionSectionProps {
  title: string;
  description: string;
  maxLines?: number;
  isLoading?: boolean;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  title,
  description,
  maxLines = 3,
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  // Skeleton para líneas de texto
  const TextLineSkeleton: React.FC<{ width?: string }> = ({ width = 'w-full' }) => (
    <View className={`${width} h-4 bg-gray-300 rounded animate-pulse mb-2`} />
  );

  const handleTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    if (lines.length > maxLines) {
      setShowReadMore(true);
    }
  };

  if (isLoading) {
    return (
      <View className='px-4 py-3'>
        {/* Título skeleton */}
        <View className='w-32 h-5 bg-gray-300 rounded animate-pulse mb-3' />
        
        {/* Líneas de descripción skeleton */}
        <TextLineSkeleton />
        <TextLineSkeleton />
        <TextLineSkeleton />
        <TextLineSkeleton width='w-3/4' />
        
        {/* Botón "Ver más" skeleton */}
        <View className='w-20 h-4 bg-gray-300 rounded animate-pulse mt-2' />
      </View>
    );
  }
// no nos muiestra el comp si no hay des
  if (!description || description.trim().length === 0) {
    return null;
  }
  return (
    <View className='px-4 py-3'>
      {/* Título de la sección */}
      <Text className='text-lg font-bold text-gray-900 mb-3'>
        {title}
      </Text>
      
      {/* Descripción */}
      <Text
        className='text-sm text-gray-600 leading-6'
        numberOfLines={isExpanded ? undefined : maxLines}
        onTextLayout={!isExpanded ? handleTextLayout : undefined}
      >
        {description}
      </Text>
      
      {/* Botón Ver más/Ver menos */}
      {showReadMore && (
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className='mt-2'
          activeOpacity={0.7}
        >
          <Text className='text-blue-600 font-medium text-sm'>
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DescriptionSection;