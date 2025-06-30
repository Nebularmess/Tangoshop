import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import usefetch from '../../hooks/useFetch';
import { getAvailableTags } from '../../utils/queryProduct';

interface ProductFilters {
  categories?: string[];
  priceRanges?: string[];
  ratings?: string[];
  tags?: string[];
}

interface TagResponse {
  tag: string;
  count: number;
}

interface TagsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: TagResponse[];
}

interface FilterPopupProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: ProductFilters) => void;
  activeFilters?: ProductFilters;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FilterPopup: React.FC<FilterPopupProps> = ({
  visible,
  onClose,
  onApplyFilters,
  activeFilters = {},
}) => {
  const [selectedFilters, setSelectedFilters] = useState<ProductFilters>({
    categories: activeFilters.categories || [],
    priceRanges: activeFilters.priceRanges || [],
    ratings: activeFilters.ratings || [],
    tags: activeFilters.tags || [],
  });

  const [availableTags, setAvailableTags] = useState<TagResponse[]>([]);
  const { data: tagsData, execute: fetchTags, loading: loadingTags } = usefetch<TagsApiResponse>();

  useEffect(() => {
    if (visible) {
      console.log('🏷️ Cargando tags disponibles...');
      fetchTags({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getAvailableTags() 
      });
    }
  }, [visible]);

  useEffect(() => {
    if (tagsData?.items) {
      console.log('✅ Tags cargadas:', tagsData.items.length);
      setAvailableTags(tagsData.items);
    }
  }, [tagsData]);

  useEffect(() => {
    setSelectedFilters({
      categories: activeFilters.categories || [],
      priceRanges: activeFilters.priceRanges || [],
      ratings: activeFilters.ratings || [],
      tags: activeFilters.tags || [],
    });
  }, [activeFilters]);

  const toggleCategory = (category: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...(prev.categories || []), category]
    }));
  };

  const togglePriceRange = (priceRange: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRanges: prev.priceRanges?.includes(priceRange)
        ? prev.priceRanges.filter(p => p !== priceRange)
        : [...(prev.priceRanges || []), priceRange]
    }));
  };

  const toggleRating = (rating: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      ratings: prev.ratings?.includes(rating)
        ? prev.ratings.filter(r => r !== rating)
        : [...(prev.ratings || []), rating]
    }));
  };

  const toggleTag = (tag: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      priceRanges: [],
      ratings: [],
      tags: [],
    });
  };

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      const filters: ProductFilters = {};
      if (selectedFilters.categories && selectedFilters.categories.length > 0) {
        filters.categories = selectedFilters.categories;
      }
      if (selectedFilters.priceRanges && selectedFilters.priceRanges.length > 0) {
        filters.priceRanges = selectedFilters.priceRanges;
      }
      if (selectedFilters.ratings && selectedFilters.ratings.length > 0) {
        filters.ratings = selectedFilters.ratings;
      }
      if (selectedFilters.tags && selectedFilters.tags.length > 0) {
        filters.tags = selectedFilters.tags;
      }

      console.log('🔧 Aplicando filtros desde popup:', filters);
      onApplyFilters(filters);
    }
    onClose();
  };

  const hasActiveFilters = 
    (selectedFilters.categories && selectedFilters.categories.length > 0) ||
    (selectedFilters.priceRanges && selectedFilters.priceRanges.length > 0) ||
    (selectedFilters.ratings && selectedFilters.ratings.length > 0) ||
    (selectedFilters.tags && selectedFilters.tags.length > 0);

  const renderFilterSection = (
    title: string,
    items: string[],
    selectedItems: string[],
    onToggle: (item: string) => void
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <TouchableOpacity 
          key={item}
          style={[
            styles.filterOption,
            selectedItems.includes(item) && styles.selectedOption
          ]}
          onPress={() => onToggle(item)}
        >
          <Text style={[
            styles.optionText,
            selectedItems.includes(item) && styles.selectedOptionText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTagItem = ({ item }: { item: TagResponse }) => {
    const isSelected = selectedFilters.tags?.includes(item.tag) || false;
    return (
      <TouchableOpacity
        style={[
          styles.tagItem,
          isSelected && styles.selectedTagItem,
        ]}
        onPress={() => toggleTag(item.tag)}
      >
        <Text
          style={[
            styles.tagText,
            isSelected && styles.selectedTagText,
          ]}
          numberOfLines={1}
        >
          {item.tag}
        </Text>
        <Text style={styles.tagCount}>({item.count})</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header del modal */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Contenido del modal */}
          <ScrollView style={styles.content}>
            {/* Categorías */}
            {renderFilterSection(
              'Categorías',
              ['Producto Deportivo', 'Ropa e indumentaria', 'Tecnologia'],
              selectedFilters.categories || [],
              toggleCategory
            )}

            {/* Tags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              {loadingTags ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Cargando tags...</Text>
                </View>
              ) : availableTags.length > 0 ? (
                <FlatList
                  data={availableTags}
                  renderItem={renderTagItem}
                  keyExtractor={(item) => item.tag}
                  numColumns={2}
                  scrollEnabled={false}
                  style={styles.tagsList}
                  columnWrapperStyle={styles.tagRow}
                />
              ) : (
                <Text style={styles.emptyText}>No hay tags disponibles</Text>
              )}
            </View>

            {/* Rango de precios */}
            {renderFilterSection(
              'Precio',
              ['0-50', '50-100', '100+'],
              selectedFilters.priceRanges || [],
              togglePriceRange
            )}

            {/* Rating */}
            {renderFilterSection(
              'Calificación',
              ['5', '4+', '3+'],
              selectedFilters.ratings || [],
              toggleRating
            )}
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.footer}>
            {hasActiveFilters && (
              <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.applyButton, hasActiveFilters && styles.applyButtonWithClear]} 
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
    minHeight: screenHeight * 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  tagsList: {
    maxHeight: 200,
  },
  tagRow: {
    justifyContent: 'space-between',
  },
  tagItem: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F8F9FA',
  },
  selectedTagItem: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 4,
  },
  selectedTagText: {
    color: '#1976D2',
    fontWeight: '500',
  },
  tagCount: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonWithClear: {
    flex: 2,
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default FilterPopup;