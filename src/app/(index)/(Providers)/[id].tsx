import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardContainer from '../../../components/ProviderComponent/CardContainer';
import ProviderHeader from '../../../components/ProviderComponent/ProviderHeader';
import ProviderInfo from '../../../components/ProviderComponent/ProviderInfo';
import DescriptionSection from '../../../components/ProviderComponent/DescriptionSection';
import ActionButtons from '../../../components/ProviderComponent/ActionButtons';
import SectionHeader from '../../../components/ProviderComponent/SectionHeader';
import ProductCard from '../../../components/ProductComponent/ProductCard';
import usefetch from "../../../hooks/useFetch";
import { getProviderById } from '../../../utils/queryProv';
import { getProductsByProvider } from '../../../utils/queryProduct';

// Interface para el proveedor completo (actualizada con nuevos campos)
interface Provider {
  _id: string;
  name: string;
  image: string;
  description?: string; // Nueva descripción
  tags: string[];
  props: {
    legal_name: string;
    industry: string;
    tax_address: string;
    phone_number?: string; // Nuevo teléfono
    email?: string; // Nuevo email
  };
}

// Interface para productos del proveedor
interface Product {
  _id: string;
  name: string;
  description: string;
  image?: string;
  type: string;
  props: {
    price: number;
    images?: string[];
  };
  object_type: [{
    name: string;
  }];
}

// Interface para la respuesta de proveedores de la API
interface ProvidersApiResponse {
  path: string;
  method: string;
  error?: any;
  items: Provider[];
}

// Interface para la respuesta de productos de la API
interface ProductsApiResponse {
  path: string;
  method: string;
  error?: any;
  items: Product[];
}

const ProviderDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  
  // Hook para obtener datos del backend
  const { data: providers, execute: fetchProvider, loading: loadingProvider, error: providerError } = usefetch<ProvidersApiResponse>();
  const { data: products, execute: fetchProducts, loading: loadingProducts } = usefetch<ProductsApiResponse>();

  // Obtener proveedor y sus productos al cargar el componente
  useEffect(() => {
    if (id) {
      console.log('🚀 Obteniendo proveedor con ID:', id);
      fetchProvider({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getProviderById(id as string) 
      });

      console.log('🛍️ Obteniendo productos del proveedor:', id);
      fetchProducts({ 
        method: 'post', 
        url: '/api/findObjects', 
        data: getProductsByProvider(id as string) 
      });
    }
  }, [id]);

  // Efecto para setear el proveedor cuando llegan los datos
  useEffect(() => {
    console.log('📊 Datos recibidos:', providers);
    if (providers?.items && providers.items.length > 0) {
      console.log('✅ Proveedor encontrado:', providers.items[0]);
      setProvider(providers.items[0]);
    }
  }, [providers]);

  // Efecto para monitorear productos
  useEffect(() => {
    console.log('🛍️ Productos recibidos:', products);
  }, [products]);

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

  // Usar descripción real de la BD o fallback más específico
  const description = provider.description?.trim() || 
    `${provider.name} es una empresa especializada en ${provider.props.industry.toLowerCase()}. ` +
    `Ubicada en ${provider.props.tax_address}, ofrecemos productos y servicios de calidad para satisfacer ` +
    `las necesidades de nuestros clientes. Contamos con amplia experiencia en el sector y un equipo ` +
    `profesional comprometido con la excelencia.`;

  console.log('📝 Descripción a mostrar:', description);
  console.log('📝 Descripción de BD:', provider.description);

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
            
            {/* Botones de acción con datos reales */}
            <ActionButtons 
              phone={provider.props.phone_number}
              email={provider.props.email}
            />
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

        {/* Productos principales */}
        <CardContainer>
          <SectionHeader
            title="Productos principales"
            subtitle={`${products?.items?.length || 0} productos disponibles`}
            icon="shopping"
          />
          
          {loadingProducts ? (
            <View className='px-4 py-8'>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text className='text-gray-500 text-center mt-2'>Cargando productos...</Text>
            </View>
          ) : products?.items?.length ? (
            <View>
              {/* Lista de productos */}
              <View className='px-4 pb-4'>
                {products.items.slice(0, 2).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    variant="list"
                    onPress={(product) => {
                      console.log('Producto seleccionado:', product.name);
                      // TODO: Navegar a detalle del producto
                    }}
                  />
                ))}
              </View>
              
              {/* Botón Ver catálogo completo debajo de los productos */}
              <View className='px-4 pb-4'>
                <TouchableOpacity
                  className='bg-blue-600 rounded-xl py-3 flex-row items-center justify-center'
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log('Navegar a catálogo completo del proveedor:', provider.name);
                    // TODO: Navegar a pantalla de catálogo completo
                  }}
                >
                  <MaterialCommunityIcons name="shopping" size={20} color="white" />
                  <Text className='text-white font-bold ml-2'>Ver catálogo completo</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className='px-4 py-8'>
              <Text className='text-gray-500 text-center'>
                Este proveedor no tiene productos disponibles
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