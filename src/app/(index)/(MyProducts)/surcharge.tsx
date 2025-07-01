import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import SurchargeCalculator from './SurchargeCalculator';
import usefetch from "../../../hooks/useFetch";
import { getSavedProducts } from '../../../utils/queryProduct';

// Interface para el producto del backend
interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  image?: string;
  type: string;
  props: {
    price: number;
    images?: string[];
    [key: string]: any;
  };
  saved_product: { _id: string }[];
}

// Interface para la respuesta de la API
interface ProductsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: BackendProduct[];
}

// Interface para productos simplificados para la calculadora
interface ProductForSurcharge {
  id: string;
  name: string;
  price: number;
  imageUri?: string;
}

const SurchargePage = () => {
  const [products, setProducts] = useState<ProductForSurcharge[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hook para obtener datos del backend
  const { data: productsData, execute: fetchProducts, loading: loadingProducts } = usefetch<ProductsApiResponse>();

  // Obtener userData del AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          setUserId(userData._id);
          console.log('✅ Usuario cargado para calculadora:', userData._id);
        } else {
          setError('No hay usuario autenticado');
          console.log('❌ No hay usuario en AsyncStorage');
        }
      } catch (error) {
        console.error('❌ Error obteniendo userData:', error);
        setError('Error al obtener información del usuario');
      }
    };

    getUserData();
  }, []);

  // Cargar productos favoritos cuando tenemos el userId
  useEffect(() => {
    if (userId) {
      console.log('🔄 Cargando productos favoritos para calculadora:', userId);
      fetchProducts({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getSavedProducts(userId)
      });
    }
  }, [userId]);

  // Procesar productos cuando llegan del backend
  useEffect(() => {
    if (!productsData?.items) {
      setProducts([]);
      return;
    }

    // Filtrar solo productos que realmente tengan saved_product no vacío
    const favoriteProducts = productsData.items.filter(product => 
      product.saved_product && product.saved_product.length > 0
    );

    // Transformar a formato simplificado para la calculadora
    const transformedProducts: ProductForSurcharge[] = favoriteProducts.map(product => ({
      id: product._id,
      name: product.name,
      price: product.props?.price || 0,
      imageUri: product.image || product.props?.images?.[0] || undefined
    }));

    console.log('✅ Productos transformados para calculadora:', transformedProducts.length);
    setProducts(transformedProducts);
    setError(null);
  }, [productsData]);

  // Componente de loading
  const LoadingComponent = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.loadingText}>Cargando productos favoritos...</Text>
    </View>
  );

  // Componente de error
  const ErrorComponent = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  // Mostrar loading
  if (loadingProducts) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingComponent />
      </SafeAreaView>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorComponent />
      </SafeAreaView>
    );
  }

  // Renderizar calculadora
  return (
    <SafeAreaView style={styles.container}>
      <SurchargeCalculator products={products} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});

export default SurchargePage;