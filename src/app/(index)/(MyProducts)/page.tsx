import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/colors';

interface Product {
  id: string;
  name: string;
  basePrice: number;
  image?: string;
  supplier?: string;
}

interface CalculationResult {
  markup: string;
  salePrice: number;
  profit: number;
  profitMargin: number;
}

export default function MyProductsScreen() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      basePrice: 800,
      supplier: 'AliExpress'
    },
    {
      id: '2',
      name: 'Auriculares Bluetooth',
      basePrice: 25,
      supplier: 'DHgate'
    },
    {
      id: '3',
      name: 'Smartwatch Deportivo',
      basePrice: 45,
      supplier: 'AliExpress'
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productSupplier, setProductSupplier] = useState('');
  const [productImage, setProductImage] = useState<string>('');
  const [profitType, setProfitType] = useState<'percentage' | 'fixed'>('percentage');
  const [profitValue, setProfitValue] = useState('');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [currentView, setCurrentView] = useState<'products' | 'calculator'>('products');

  const calculateProfit = () => {
    const basePrice = selectedProduct?.basePrice || parseFloat(productPrice) || 0;
    const profitNum = parseFloat(profitValue);

    if (!basePrice || !profitNum || basePrice <= 0 || profitNum <= 0) {
      setResults(null);
      return;
    }

    let markup: string;
    let salePrice: number;
    let profit: number;
    let profitMargin: number;

    if (profitType === 'percentage') {
      profit = (basePrice * profitNum) / 100;
      salePrice = basePrice + profit;
      markup = `${profitNum}%`;
      profitMargin = profitNum;
    } else {
      profit = profitNum;
      salePrice = basePrice + profit;
      markup = `$${profit}`;
      profitMargin = (profit / basePrice) * 100;
    }

    setResults({
      markup,
      salePrice,
      profit,
      profitMargin,
    });
  };

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductPrice(product.basePrice.toString());
    setProductSupplier(product.supplier || '');
    setProductImage(product.image || '');
    setCurrentView('calculator');
    setIsCreatingProduct(false);
    setResults(null);
  };

  const createNewProduct = () => {
    setSelectedProduct(null);
    setProductName('');
    setProductPrice('');
    setProductSupplier('');
    setProductImage('');
    setIsCreatingProduct(true);
    setCurrentView('calculator');
    setResults(null);
  };

  const saveProduct = () => {
    if (!productName || !productPrice) {
      Alert.alert('Error', 'Por favor completa el nombre y precio del producto');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName,
      basePrice: parseFloat(productPrice),
      supplier: productSupplier || 'Sin especificar',
      image: productImage
    };

    setProducts(prev => [...prev, newProduct]);
    setSelectedProduct(newProduct);
    setIsCreatingProduct(false);
    Alert.alert('Éxito', 'Producto guardado correctamente');
  };

  const deleteProduct = (productId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProducts(prev => prev.filter(p => p.id !== productId));
            if (selectedProduct?.id === productId) {
              setSelectedProduct(null);
              setCurrentView('products');
            }
          }
        }
      ]
    );
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permisos necesarios', 'Se necesitan permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0].uri);
    }
  };

  const resetCalculator = () => {
    setProfitValue('');
    setResults(null);
  };

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Ionicons name="calculator" size={24} color={COLORS.text} />
        <Text style={styles.headerTitle}>
          {currentView === 'products' ? 'Mis Productos' : 'Calculadora'}
        </Text>
      </View>
      {currentView === 'calculator' && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentView('products')}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const ProductsView = () => (
    <ScrollView style={styles.scrollContainer}>
      <TouchableOpacity style={styles.addButton} onPress={createNewProduct}>
        <View style={styles.addButtonContent}>
          <Ionicons name="add" size={20} color={COLORS.text} />
          <Text style={styles.addButtonText}>Agregar Nuevo Producto</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.productsList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSupplier}>Proveedor: {product.supplier}</Text>
              <Text style={styles.productPrice}>${product.basePrice.toFixed(2)}</Text>
            </View>
            <View style={styles.productActions}>
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={() => selectProduct(product)}
              >
                <Ionicons name="calculator" size={16} color={COLORS.text} />
                <Text style={styles.calculateButtonText}>Calcular</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteProduct(product.id)}
              >
                <Ionicons name="trash" size={16} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const CalculatorView = () => (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📸 Imagen del Producto</Text>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {productImage ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: productImage }} style={styles.productImagePreview} />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color={COLORS.text} />
              </View>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <View style={styles.uploadIcon}>
                <Ionicons name="cloud-upload" size={32} color="#999" />
              </View>
              <Text style={styles.uploadText}>Seleccionar imagen</Text>
              <Text style={styles.uploadSubtext}>Toca para elegir</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>🏷️ Nombre del Producto</Text>
          <TextInput
            style={styles.textInput}
            value={productName}
            onChangeText={setProductName}
            placeholder="Ej: iPhone 15 Pro"
            placeholderTextColor="#999"
            editable={isCreatingProduct || !selectedProduct}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>🏪 Proveedor</Text>
          <TextInput
            style={styles.textInput}
            value={productSupplier}
            onChangeText={setProductSupplier}
            placeholder="Ej: AliExpress, DHgate"
            placeholderTextColor="#999"
            editable={isCreatingProduct || !selectedProduct}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>💰 Precio Base</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.priceInput}
              value={productPrice}
              onChangeText={setProductPrice}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
              editable={isCreatingProduct || !selectedProduct}
            />
          </View>
        </View>

        {isCreatingProduct && (
          <TouchableOpacity
            style={[styles.saveButton, (!productName || !productPrice) && styles.saveButtonDisabled]}
            onPress={saveProduct}
            disabled={!productName || !productPrice}
          >
            <View style={styles.saveButtonContent}>
              <Text style={styles.saveButtonText}>💾 Guardar Producto</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Configuración de Ganancia</Text>
        
        <View style={styles.profitTypeContainer}>
          <TouchableOpacity
            style={[styles.profitTypeButton, profitType === 'percentage' && styles.profitTypeButtonActive]}
            onPress={() => {
              setProfitType('percentage');
              setProfitValue('');
            }}
          >
            <Ionicons name="calculator" size={16} color={profitType === 'percentage' ? COLORS.text : '#999'} />
            <Text style={[styles.profitTypeText, profitType === 'percentage' && styles.profitTypeTextActive]}>
              Porcentual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profitTypeButton, profitType === 'fixed' && styles.profitTypeButtonActive]}
            onPress={() => {
              setProfitType('fixed');
              setProfitValue('');
            }}
          >
            <Ionicons name="cash" size={16} color={profitType === 'fixed' ? COLORS.text : '#999'} />
            <Text style={[styles.profitTypeText, profitType === 'fixed' && styles.profitTypeTextActive]}>
              Fija
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {profitType === 'percentage' ? 'Ganancia Porcentual' : 'Ganancia Fija'}
          </Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>
              {profitType === 'percentage' ? '%' : '$'}
            </Text>
            <TextInput
              style={styles.priceInput}
              value={profitValue}
              onChangeText={(text) => {
                setProfitValue(text);
                setTimeout(() => {
                  if (text && (selectedProduct || productPrice)) {
                    calculateProfit();
                  }
                }, 100);
              }}
              placeholder={profitType === 'percentage' ? '25' : '100.00'}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {results && (
        <View style={styles.resultsCard}>
          <View style={styles.resultsHeader}>
            <View style={styles.resultsIcon}>
              <Ionicons name="cube" size={24} color={COLORS.text} />
            </View>
            <Text style={styles.resultsTitle}>Resumen Detallado</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>📦 Producto</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Nombre:</Text>
              <Text style={styles.summaryValue}>{productName || 'Sin nombre'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Precio base:</Text>
              <Text style={styles.summaryValueBold}>
                ${(selectedProduct?.basePrice || parseFloat(productPrice) || 0).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.profitSection}>
            <Text style={styles.sectionTitleProfit}>💹 Ganancia</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tipo:</Text>
              <Text style={styles.summaryValue}>
                {profitType === 'percentage' ? 'Porcentual' : 'Fija'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sobreprecio:</Text>
              <Text style={styles.profitValue}>{results.markup}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ganancia:</Text>
              <Text style={styles.profitValue}>${results.profit.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Margen:</Text>
              <Text style={styles.profitValue}>{results.profitMargin.toFixed(1)}%</Text>
            </View>
          </View>

          <View style={styles.finalPriceSection}>
            <Text style={styles.finalPriceLabel}>💰 Precio Final</Text>
            <Text style={styles.finalPriceValue}>${results.salePrice.toFixed(2)}</Text>
            <Text style={styles.finalPriceSubtext}>Precio de venta sugerido</Text>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={resetCalculator}>
            <Text style={styles.resetButtonText}>🔄 Limpiar Cálculo</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.container}>
        <Header />
        {currentView === 'products' ? <ProductsView /> : <CalculatorView />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  addButton: {
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  productInfo: {
    marginBottom: 12,
  },
  productName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productSupplier: {
    color: '#999',
    fontSize: 13,
    marginBottom: 6,
  },
  productPrice: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calculateButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  calculateButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  imageContainer: {
    backgroundColor: '#333',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#555',
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
  },
  productImagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  cameraIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 6,
  },
  imagePlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  uploadIcon: {
    backgroundColor: '#555',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
  },
  uploadText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
  },
  currencySymbol: {
    color: '#999',
    fontSize: 16,
    paddingLeft: 12,
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonContent: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  profitTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  profitTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  profitTypeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  profitTypeText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  profitTypeTextActive: {
    color: COLORS.text,
  },
  resultsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsIcon: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  resultsTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  summarySection: {
    backgroundColor: 'rgba(0, 141, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  profitSection: {
    backgroundColor: 'rgba(0, 200, 100, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTitleProfit: {
    color: '#00c864',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#999',
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  summaryValueBold: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  profitValue: {
    color: '#00c864',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalPriceSection: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  finalPriceLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  finalPriceValue: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  finalPriceSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  resetButton: {
    borderWidth: 2,
    borderColor: '#555',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
});