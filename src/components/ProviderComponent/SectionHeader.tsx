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
  isLoading?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
  showArrow = false,
  icon,
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
      <View className='px-4 py-3 border-b border-gray-100'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center flex-1'>
            {/* Icono skeleton */}
            <View className='w-5 h-5 bg-gray-300 rounded animate-pulse mr-2' />
            
            {/* Título y subtítulo skeleton */}
            <View className='flex-1'>
              <TextSkeleton width='w-32' height='h-5' />
              <View className='mt-1'>
                <TextSkeleton width='w-24' height='h-3' />
              </View>
            </View>
          </View>

          {/* Acción skeleton */}
          <View className='flex-row items-center'>
            <TextSkeleton width='w-16' height='h-4' />
            <View className='w-5 h-5 bg-gray-300 rounded animate-pulse ml-1' />
          </View>
        </View>
      </View>
    );
  }

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