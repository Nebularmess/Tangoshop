import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Interface para el producto simplificado
interface ProductForSurcharge {
  id: string;
  name: string;
  price: number;
  imageUri?: string;
}

// Props del componente
interface SurchargeCalculatorProps {
  products: ProductForSurcharge[];
}

// Tipos de cálculo
type CalculationType = 'percentage' | 'fixed';

const SurchargeCalculator: React.FC<SurchargeCalculatorProps> = ({ products }) => {
  const router = useRouter();
  
  // Estados
  const [calculationType, setCalculationType] = useState<CalculationType>('percentage');
  const [surchargeValue, setSurchargeValue] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductForSurcharge | null>(null);
  const [calculatedResults, setCalculatedResults] = useState<{
    originalPrice: number;
    surchargeAmount: number;
    finalPrice: number;
    profit: number;
  } | null>(null);

  // Seleccionar el primer producto por defecto
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products]);

  // Función para calcular el sobreprecio
  const calculateSurcharge = () => {
    if (!selectedProduct || !surchargeValue.trim()) return;

    const originalPrice = selectedProduct.price;
    const surchargeNum = parseFloat(surchargeValue);

    if (isNaN(surchargeNum) || surchargeNum < 0) return;

    let surchargeAmount = 0;
    let finalPrice = 0;

    if (calculationType === 'percentage') {
      surchargeAmount = (originalPrice * surchargeNum) / 100;
      finalPrice = originalPrice + surchargeAmount;
    } else {
      surchargeAmount = surchargeNum;
      finalPrice = originalPrice + surchargeAmount;
    }

    setCalculatedResults({
      originalPrice,
      surchargeAmount,
      finalPrice,
      profit: surchargeAmount
    });
  };

  // Función para limpiar cálculos
  const clearCalculation = () => {
    setSurchargeValue('');
    setCalculatedResults(null);
  };

  // Función para guardar (placeholder)
  const saveCalculation = () => {
    // Aquí puedes implementar la lógica para guardar
    console.log('Guardando cálculo:', calculatedResults);
    // Podrías mostrar un toast o modal de confirmación
  };

  // Componente para seleccionar producto
  const ProductSelector = () => (
    <View style={styles.productSelectorContainer}>
      <Text style={styles.sectionTitle}>Seleccionar Producto</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.productScrollView}
      >
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[
              styles.productItem,
              selectedProduct?.id === product.id && styles.selectedProductItem
            ]}
            onPress={() => setSelectedProduct(product)}
          >
            <Image
              source={{ 
                uri: product.imageUri || 'https://via.placeholder.com/80x80/F3F4F6/6B7280?text=Producto'
              }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.productPrice}>
              ${product.price.toLocaleString('es-AR')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Componente del producto seleccionado (similar al diseño de Figma)
  const SelectedProductCard = () => {
    if (!selectedProduct) return null;

    return (
      <View style={styles.selectedProductCard}>
        <View style={styles.productCardHeader}>
          <Image
            source={{ 
              uri: selectedProduct.imageUri || 'https://via.placeholder.com/60x60/F3F4F6/6B7280?text=Producto'
            }}
            style={styles.selectedProductImage}
            resizeMode="cover"
          />
          <View style={styles.productDetails}>
            <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
            <Text style={styles.costLabel}>Costo</Text>
            <Text style={styles.costValue}>
              ${selectedProduct.price.toLocaleString('es-AR')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Componente de selector de tipo de cálculo
  const CalculationTypeSelector = () => (
    <View style={styles.calculationTypeContainer}>
      <Text style={styles.sectionTitle}>Ganancia</Text>
      <View style={styles.typeButtons}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            calculationType === 'percentage' && styles.activeTypeButton
          ]}
          onPress={() => setCalculationType('percentage')}
        >
          <Text style={[
            styles.typeButtonText,
            calculationType === 'percentage' && styles.activeTypeButtonText
          ]}>
            % Porcentual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            calculationType === 'fixed' && styles.activeTypeButton
          ]}
          onPress={() => setCalculationType('fixed')}
        >
          <Text style={[
            styles.typeButtonText,
            calculationType === 'fixed' && styles.activeTypeButtonText
          ]}>
            $ Fija
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Componente de entrada de datos
  const SurchargeInput = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {calculationType === 'percentage' 
          ? 'Ingrese ganancia porcentual' 
          : 'Ingrese ganancia fija'
        }
      </Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputPrefix}>
          {calculationType === 'percentage' ? '%' : '$'}
        </Text>
        <TextInput
          style={styles.input}
          value={surchargeValue}
          onChangeText={setSurchargeValue}
          placeholder={calculationType === 'percentage' ? '10' : '1000'}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.calculateButton} onPress={calculateSurcharge}>
        <Text style={styles.calculateButtonText}>Calcular</Text>
      </TouchableOpacity>
    </View>
  );

  // Componente de resumen (similar al diseño de Figma)
  const ResultSummary = () => {
    if (!calculatedResults) return null;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumen</Text>
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Costo:</Text>
            <Text style={styles.summaryValue}>
              ${calculatedResults.originalPrice.toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sobreprecio:</Text>
            <Text style={styles.summaryValue}>
              {calculationType === 'percentage' 
                ? `${surchargeValue}%`
                : `${calculatedResults.surchargeAmount.toLocaleString('es-AR')}`
              }
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Precio de venta:</Text>
            <Text style={styles.summaryValue}>
              ${calculatedResults.finalPrice.toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ganancia:</Text>
            <Text style={styles.profitValue}>
              ${calculatedResults.profit.toLocaleString('es-AR')}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={saveCalculation}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calculadora de Sobreprecio</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="calculator-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No hay productos favoritos</Text>
          <Text style={styles.emptyText}>
            Agrega productos a favoritos para calcular sobreprecios
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculadora de Sobreprecio</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Selector de productos horizontal */}
        <ProductSelector />

        {/* Tarjeta del producto seleccionado */}
        <SelectedProductCard />

        {/* Selector de tipo de cálculo */}
        <CalculationTypeSelector />

        {/* Input para sobreprecio */}
        <SurchargeInput />

        {/* Resumen de resultados */}
        <ResultSummary />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E40AF',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  productSelectorContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  productScrollView: {
    flexDirection: 'row',
  },
  productItem: {
    width: 100,
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedProductItem: {
    borderColor: '#2563EB',
    backgroundColor: '#EBF4FF',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  selectedProductCard: {
    backgroundColor: '#2563EB',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  selectedProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  selectedProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  costValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  calculationTypeContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtons: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#2563EB',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTypeButtonText: {
    color: 'white',
  },
  inputContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 16,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  calculateButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#2563EB',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryContent: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  profitValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  saveButton: {
    backgroundColor: '#06B6D4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SurchargeCalculator;