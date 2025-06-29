import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FilterState {
  categories: string[];
  priceRanges: string[];
  ratings: string[];
}

interface FilterPopupProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FilterPopup: React.FC<FilterPopupProps> = ({
  visible,
  onClose,
  onApplyFilters,
}) => {
  // Estado para manejar los filtros seleccionados
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    ratings: [],
  });

  // Función para manejar la selección de categorías
  const toggleCategory = (category: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  // Función para manejar la selección de rangos de precio
  const togglePriceRange = (priceRange: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(priceRange)
        ? prev.priceRanges.filter(p => p !== priceRange)
        : [...prev.priceRanges, priceRange]
    }));
  };

  // Función para manejar la selección de ratings
  const toggleRating = (rating: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter(r => r !== rating)
        : [...prev.ratings, rating]
    }));
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      priceRanges: [],
      ratings: [],
    });
  };

  // Función para aplicar filtros
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(selectedFilters);
    }
    onClose();
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categorías</Text>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.categories.includes('Electrónicos') && styles.selectedOption
                ]}
                onPress={() => toggleCategory('Electrónicos')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.categories.includes('Electrónicos') && styles.selectedOptionText
                ]}>
                  Tecnología
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.categories.includes('Ropa') && styles.selectedOption
                ]}
                onPress={() => toggleCategory('Ropa')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.categories.includes('Ropa') && styles.selectedOptionText
                ]}>
                  Ropa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.categories.includes('Hogar') && styles.selectedOption
                ]}
                onPress={() => toggleCategory('Hogar')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.categories.includes('Hogar') && styles.selectedOptionText
                ]}>
                  Hogar
                </Text>
              </TouchableOpacity>
            </View>

            {/* Rango de precios */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Precio</Text>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.priceRanges.includes('0-50') && styles.selectedOption
                ]}
                onPress={() => togglePriceRange('0-50')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.priceRanges.includes('0-50') && styles.selectedOptionText
                ]}>
                  $0 - $50
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.priceRanges.includes('50-100') && styles.selectedOption
                ]}
                onPress={() => togglePriceRange('50-100')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.priceRanges.includes('50-100') && styles.selectedOptionText
                ]}>
                  $50 - $100
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.priceRanges.includes('100+') && styles.selectedOption
                ]}
                onPress={() => togglePriceRange('100+')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.priceRanges.includes('100+') && styles.selectedOptionText
                ]}>
                  $100+
                </Text>
              </TouchableOpacity>
            </View>

            {/* Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Calificación</Text>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.ratings.includes('5') && styles.selectedOption
                ]}
                onPress={() => toggleRating('5')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.ratings.includes('5') && styles.selectedOptionText
                ]}>
                  5 estrellas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.ratings.includes('4+') && styles.selectedOption
                ]}
                onPress={() => toggleRating('4+')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.ratings.includes('4+') && styles.selectedOptionText
                ]}>
                  4+ estrellas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  selectedFilters.ratings.includes('3+') && styles.selectedOption
                ]}
                onPress={() => toggleRating('3+')}
              >
                <Text style={[
                  styles.optionText,
                  selectedFilters.ratings.includes('3+') && styles.selectedOptionText
                ]}>
                  3+ estrellas
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
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
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FFFFFF',
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
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default FilterPopup;