import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DescriptionSectionProps {
  title: string;
  description: string;
  maxLines?: number;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  title,
  description,
  maxLines = 3
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const handleTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    if (lines.length > maxLines) {
      setShowReadMore(true);
    }
  };

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