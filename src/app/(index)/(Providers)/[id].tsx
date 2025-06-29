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
import { getProviderById } from '../../../utils/queryProv';

// Interface para el proveedor completo (igual que en tu index)
interface Provider {
  _id: string;
  name: string;
  image: string;
  tags: string[];
  props: {
    legal_name: string;
    industry: string;
    tax_address: string;
  };
}

// Interface para la respuesta de la API (igual que en tu index)
interface ProvidersApiResponse {
  path: string;
  method: string;
  error?: any;
  items: Provider[];
}

const ProviderDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  
  // Hook para obtener datos del backend (igual que en tu index)
  const { data: providers, execute: fetchProvider, loading: loadingProvider, error: providerError } = usefetch<ProvidersApiResponse>();

  // Obtener proveedor al cargar el componente (igual que en tu index)
  useEffect(() => {
    if (id) {
      console.log('🚀 Obteniendo proveedor con ID:', id);
      fetchProvider({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getProviderById(id as string) 
      });
    }
  }, [id]);

  // Efecto para setear el proveedor cuando llegan los datos (igual que en tu index)
  useEffect(() => {
    console.log('📊 Datos recibidos:', providers);
    if (providers?.items && providers.items.length > 0) {
      console.log('✅ Proveedor encontrado:', providers.items[0]);
      setProvider(providers.items[0]);
    }
  }, [providers]);

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

  // Pantalla de error - SOLO si ya terminó de cargar Y hay error O no hay provider
  if (!loadingProvider && (providerError || (!provider && providers?.items?.length === 0))) {
    return (
      <SafeAreaView className='flex-1 bg-gray-100'>
        <View className='flex-1 justify-center items-center px-4'>
          <Text className='text-red-600 text-lg font-bold mb-2'>Error</Text>
          <Text className='text-gray-600 text-center mb-4'>
            No se pudo cargar la información del proveedor
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si aún está cargando o no hay provider pero tampoco hay error, mostrar loading
  if (!provider) {
    return (
      <SafeAreaView className='flex-1 bg-gray-100'>
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className='text-gray-600 mt-4'>Cargando proveedor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Descripción por defecto si no existe
  const description = 
    `${provider.name} es una empresa especializada en ${provider.props.industry.toLowerCase()}. ` +
    `Ubicada en ${provider.props.tax_address}, ofrecemos productos y servicios de calidad para satisfacer ` +
    `las necesidades de nuestros clientes. Contamos con amplia experiencia en el sector y un equipo ` +
    `profesional comprometido con la excelencia.`;

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Imagen de fondo - SIN contenedor */}
        <ProviderHeader
          backgroundImage={provider.image}
          logoImage={provider.image}
          providerName={provider.name}
          height={250}
        />
        
        {/* Contenedor principal con bordes redondeados que se superpone */}
        <CardContainer 
          padding="none" 
          margin="none" 
          style={{ 
            marginTop: -20,  // Se superpone ligeramente con la imagen
            marginHorizontal: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            zIndex: 1, // Z-index menor que el logo
          }}
        >
          {/* Información básica del proveedor con padding superior para el logo */}
          <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 }}>
            <ProviderInfo
              name={provider.name}
              industry={provider.props.industry}
              address={provider.props.tax_address}
              tags={provider.tags}
            />
            
            {/* Botones de acción */}
            <ActionButtons />
          </View>
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

        {/* Espaciado inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProviderDetailScreen;