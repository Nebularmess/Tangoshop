import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
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
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Buscar productos</Text>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={onSearchChange}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sortSection}>
          <Text style={styles.sectionTitle}>Ordenar por</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.sortButtonContent}>
              <MaterialCommunityIcons name="sort" size={20} color="#6B7280" />
              <Text style={styles.sortButtonText} numberOfLines={1}>
                {getCurrentSortLabel()}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ordenar productos</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortBy === option.key && styles.sortOptionActive
                ]}
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
                  style={[
                    styles.sortOptionText,
                    sortBy === option.key && styles.sortOptionTextActive
                  ]}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2563EB',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: '500',
    marginBottom: 8,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#111827',
    fontSize: 16,
  },
  sortSection: {},
  sortButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sortButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sortButtonText: {
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionActive: {
    backgroundColor: '#EFF6FF',
  },
  sortOptionText: {
    marginLeft: 12,
    flex: 1,
    color: '#374151',
  },
  sortOptionTextActive: {
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default CatalogFilter;