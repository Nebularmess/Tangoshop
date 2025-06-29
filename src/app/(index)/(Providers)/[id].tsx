import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CardContainer from '../../../components/ProviderComponent/CardContainer';
import ProviderHeader from '../../../components/ProviderComponent/ProviderHeader';
import ProviderInfo from '../../../components/ProviderComponent/ProviderInfo';
import DescriptionSection from '../../../components/ProviderComponent/DescriptionSection';
import ActionButtons from '../../../components/ProviderComponent/ActionButtons';
import SectionHeader from '../../../components/ProviderComponent/SectionHeader';
import usefetch from "../../../hooks/useFetch";

// Interface para el proveedor completo
interface ProviderDetail {
  _id: string;
  name: string;
  image: string;
  tags: string[];
  props: {
    legal_name: string;
    industry: string;
    tax_address: string;
    description?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

// Interface para productos del proveedor
interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

// Interface para la respuesta de la API
interface ProviderApiResponse {
  path: string;
  method: string;
  error?: any;
  items: ProviderDetail[];
}

interface ProductsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: Product[];
}

const ProviderDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  
  // Debug logs
  console.log('🔍 Provider Detail Screen - ID recibido:', id);
  console.log('🔍 Tipo de ID:', typeof id);
  
  // Hooks para obtener datos
  const { data: providerData, execute: fetchProvider, loading: loadingProvider, error: providerError } = usefetch<ProviderApiResponse>();
  const { data: productsData, execute: fetchProducts, loading: loadingProducts } = usefetch<ProductsApiResponse>();

  // Query para obtener el proveedor específico
  const getProviderById = [
    {
      "$match": {
        "_id": { "$oid": id as string }, // Convertir string a ObjectId
        "type": "commerce"
      }
    },
    {
      "$project": {
        "name": 1,
        "image": 1,
        "tags": 1,
        "props": 1
      }
    }
  ];

  // Query alternativa si la primera no funciona
  const getProviderByIdAlt = [
    {
      "$addFields": {
        "_id_str": { "$toString": "$_id" }
      }
    },
    {
      "$match": {
        "_id_str": id as string,
        "type": "commerce"
      }
    },
    {
      "$project": {
        "name": 1,
        "image": 1,
        "tags": 1,
        "props": 1
      }
    }
  ];

  console.log('📋 Query alternativa:', JSON.stringify(getProviderByIdAlt, null, 2));

  // Query para obtener productos del proveedor
  const getProviderProducts = [
    {
      "$match": {
        "owner": id,
        "type": "product"
      }
    },
    {
      "$project": {
        "name": 1,
        "image": 1,
        "props.price": 1,
        "props.description": 1
      }
    },
    {
      "$limit": 10
    }
  ];

  useEffect(() => {
    console.log('🚀 useEffect ejecutado con ID:', id);
    if (id) {
      console.log('📡 Probando primera query (ObjectId)...');
      // Primero probamos con ObjectId
      fetchProvider({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getProviderById 
      });

      console.log('📡 Ejecutando fetchProducts...');
      // Obtener productos del proveedor
      fetchProducts({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getProviderProducts 
      });
    } else {
      console.log('❌ No hay ID disponible');
    }
  }, [id]);

  useEffect(() => {
    console.log('📊 providerData cambió:', providerData);
    console.log('📊 providerError:', providerError);
    
    if (providerData?.items && providerData.items.length > 0) {
      console.log('✅ Proveedor encontrado:', providerData.items[0]);
      setProvider(providerData.items[0]);
    } else if (providerData?.items?.length === 0) {
      console.log('❌ Array vacío, probando query alternativa...');
      // Si la primera query no funciona, probamos la alternativa
      fetchProvider({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getProviderByIdAlt 
      });
    }
  }, [providerData, providerError]);

  // Pantalla de carga
  if (loadingProvider) {
    return (
      <SafeAreaView className='flex-1 bg-gray-100'>
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className='text-gray-600 mt-4'>Cargando proveedor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Pantalla de error
  if (providerError || !provider) {
    return (
      <SafeAreaView className='flex-1 bg-gray-100'>
        <View className='flex-1 justify-center items-center px-4'>
          <Text className='text-red-600 text-lg font-bold mb-2'>Error</Text>
          <Text className='text-gray-600 text-center mb-4'>
            No se pudo cargar la información del proveedor
          </Text>
          
          {/* Debug info */}
          <View className='bg-red-50 p-4 rounded-lg w-full'>
            <Text className='text-xs text-red-800 font-bold mb-2'>DEBUG INFO:</Text>
            <Text className='text-xs text-red-700'>ID: {JSON.stringify(id)}</Text>
            <Text className='text-xs text-red-700'>Loading: {loadingProvider.toString()}</Text>
            <Text className='text-xs text-red-700'>Error: {JSON.stringify(providerError)}</Text>
            <Text className='text-xs text-red-700'>Data: {JSON.stringify(providerData)}</Text>
            <Text className='text-xs text-red-700'>Provider: {JSON.stringify(provider)}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Descripción por defecto si no existe
  const description = provider.props.description || 
    `${provider.name} es una empresa especializada en ${provider.props.industry.toLowerCase()}. ` +
    `Ubicada en ${provider.props.tax_address}, ofrecemos productos y servicios de calidad para satisfacer ` +
    `las necesidades de nuestros clientes. Contamos con amplia experiencia en el sector y un equipo ` +
    `profesional comprometido con la excelencia.`;

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Header con imagen de fondo y logo */}
        <CardContainer padding="none" margin="none">
          <ProviderHeader
            backgroundImage={provider.image}
            logoImage={provider.image}
            providerName={provider.name}
            height={250}
          />
          
          {/* Información básica del proveedor */}
          <ProviderInfo
            name={provider.name}
            industry={provider.props.industry}
            address={provider.props.tax_address}
            tags={provider.tags}
          />
          
          {/* Botones de acción */}
          <ActionButtons
            phone={provider.props.phone}
            email={provider.props.email}
            website={provider.props.website}
          />
        </CardContainer>

        {/* Descripción */}
        <CardContainer>
          <DescriptionSection
            title="Descripción"
            description={description}
            maxLines={4}
          />
        </CardContainer>

        {/* Información de contacto */}
        <CardContainer>
          <SectionHeader
            title="Información de Contacto"
            icon="card-account-details"
          />
          
          <View className='px-4 pb-4'>
            {/* Razón social */}
            <View className='flex-row justify-between items-center py-3 border-b border-gray-100'>
              <Text className='text-gray-600 font-medium'>Razón Social</Text>
              <Text className='text-gray-900 font-medium flex-1 text-right ml-4' numberOfLines={2}>
                {provider.props.legal_name}
              </Text>
            </View>
            
            {/* Dirección */}
            <View className='flex-row justify-between items-start py-3 border-b border-gray-100'>
              <Text className='text-gray-600 font-medium'>Dirección</Text>
              <Text className='text-gray-900 flex-1 text-right ml-4' numberOfLines={3}>
                {provider.props.tax_address}
              </Text>
            </View>
            
            {/* Industria */}
            <View className='flex-row justify-between items-center py-3'>
              <Text className='text-gray-600 font-medium'>Rubro</Text>
              <Text className='text-gray-900 font-medium'>
                {provider.props.industry}
              </Text>
            </View>
          </View>
        </CardContainer>

        {/* Productos principales */}
        <CardContainer>
          <SectionHeader
            title="Productos Principales"
            subtitle={`${productsData?.items?.length || 0} productos disponibles`}
            actionText="Ver catálogo completo"
            showArrow={true}
            icon="shopping"
            onActionPress={() => {
              console.log('Navegar a catálogo completo');
              // Aquí podrías navegar a una pantalla de productos
            }}
          />
          
          {loadingProducts ? (
            <View className='px-4 py-8'>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text className='text-gray-500 text-center mt-2'>Cargando productos...</Text>
            </View>
          ) : productsData?.items?.length ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className='px-4 pb-4'
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {productsData.items.slice(0, 5).map((product, index) => (
                <View key={product._id} className='bg-gray-50 rounded-xl p-3 mr-3' style={{ width: 120 }}>
                  <View className='w-full h-20 bg-gray-200 rounded-lg mb-2' />
                  <Text className='text-sm font-medium text-gray-900 mb-1' numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text className='text-xs text-green-600 font-bold'>
                    ${product.price?.toLocaleString() || 'Consultar'}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className='px-4 py-8'>
              <Text className='text-gray-500 text-center'>
                No hay productos disponibles
              </Text>
            </View>
          )}
        </CardContainer>

        {/* Espaciado inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProviderDetailScreen;