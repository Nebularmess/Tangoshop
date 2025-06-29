import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CatalogFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'name' | 'price-asc' | 'price-desc';
  onSortChange: (sort: 'name' | 'price-asc' | 'price-desc') => void;
}

const CatalogFilter: React.FC<CatalogFilterProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  const [showSortModal, setShowSortModal] = useState(false);

  const sortOptions = [
    { key: 'name', label: 'Alfabéticamente (A-Z)', icon: 'sort-alphabetical-ascending' },
    { key: 'price-asc', label: 'Precio: Menor a Mayor', icon: 'sort-numeric-ascending' },
    { key: 'price-desc', label: 'Precio: Mayor a Menor', icon: 'sort-numeric-descending' },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === sortBy);
    return option?.label || 'Ordenar por';
  };

  return (
    <>
      {/* Componente de filtros con fondo azul */}
      <View 
        className='bg-blue-600 mx-4 my-3 rounded-xl p-4'
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {/* Campo de búsqueda */}
        <View className='mb-3'>
          <Text className='text-white font-medium mb-2'>Buscar productos</Text>
          <View className='bg-white rounded-lg flex-row items-center px-3 py-2'>
            <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
            <TextInput
              className='flex-1 ml-2 text-gray-900'
              placeholder="Buscar por nombre..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={onSearchChange}
              style={{ fontSize: 16 }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Selector de ordenamiento */}
        <View>
          <Text className='text-white font-medium mb-2'>Ordenar por</Text>
          <TouchableOpacity
            className='bg-white rounded-lg flex-row items-center justify-between px-3 py-3'
            onPress={() => setShowSortModal(true)}
            activeOpacity={0.8}
          >
            <View className='flex-row items-center flex-1'>
              <MaterialCommunityIcons name="sort" size={20} color="#6B7280" />
              <Text className='text-gray-900 ml-2 flex-1' numberOfLines={1}>
                {getCurrentSortLabel()}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de opciones de ordenamiento */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity 
          className='flex-1 bg-black/50 justify-center items-center px-4'
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View 
            className='bg-white rounded-xl p-4 w-full max-w-sm'
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 8,
            }}
          >
            {/* Título del modal */}
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-lg font-bold text-gray-900'>Ordenar productos</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Opciones de ordenamiento */}
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                className={`flex-row items-center py-3 px-2 rounded-lg mb-2 ${
                  sortBy === option.key ? 'bg-blue-50' : 'bg-transparent'
                }`}
                onPress={() => {
                  onSortChange(option.key as 'name' | 'price-asc' | 'price-desc');
                  setShowSortModal(false);
                }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name={option.icon as any} 
                  size={20} 
                  color={sortBy === option.key ? "#2563EB" : "#6B7280"} 
                />
                <Text 
                  className={`ml-3 flex-1 ${
                    sortBy === option.key 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </Text>
                {sortBy === option.key && (
                  <MaterialCommunityIcons name="check" size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default CatalogFilter;