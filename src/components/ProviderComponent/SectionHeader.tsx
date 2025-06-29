import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  showArrow?: boolean;
  icon?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
  showArrow = false,
  icon
}) => {
  return (
    <View className='px-4 py-3 border-b border-gray-100'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center flex-1'>
          {/* Icono opcional */}
          {icon && (
            <MaterialCommunityIcons 
              name={icon as any} 
              size={20} 
              color="#374151" 
              style={{ marginRight: 8 }}
            />
          )}
          
          {/* Título y subtítulo */}
          <View className='flex-1'>
            <Text className='text-lg font-bold text-gray-900'>
              {title}
            </Text>
            {subtitle && (
              <Text className='text-sm text-gray-500 mt-1'>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Acción opcional */}
        {(actionText || showArrow) && (
          <TouchableOpacity
            onPress={onActionPress}
            className='flex-row items-center'
            activeOpacity={0.7}
          >
            {actionText && (
              <Text className='text-blue-600 font-medium mr-1'>
                {actionText}
              </Text>
            )}
            {showArrow && (
              <MaterialCommunityIcons name="chevron-right" size={20} color="#2563EB" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SectionHeader;