import React, { useEffect, useState, useRef } from 'react';
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
import CatalogFilter from '../../../components/ProviderComponent/CatalogFilter';
import usefetch from "../../../hooks/useFetch";
import { getProviderById } from '../../../utils/queryProv';
import { getProductsByProvider } from '../../../utils/queryProduct';

// Interface para el proveedor completo (actualizada con nuevos campos)
interface Provider {
  _id: string;
  name: string;
  image: string;
  description?: string;
  tags: string[];
  props: {
    legal_name: string;
    industry: string;
    tax_address: string;
    phone_number?: string;
    email?: string;
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
  const [showCatalog, setShowCatalog] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Estados para filtros del catálogo
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Hooks para obtener datos del backend
  const { data: providers, execute: fetchProvider, loading: loadingProvider, error: providerError } = usefetch<ProvidersApiResponse>();
  const { data: products, execute: fetchProducts, loading: loadingProducts } = usefetch<ProductsApiResponse>();

  // ==================== COMPONENTES DE LOADING ====================
  
  // Skeleton para texto
  const TextSkeleton: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
    width = 'w-full', 
    height = 'h-4',
    className = ''
  }) => (
    <View className={`${width} ${height} bg-gray-300 rounded animate-pulse ${className}`} />
  );

  // Skeleton para ProviderHeader
  const ProviderHeaderSkeleton = () => (
    <View style={{ height: showCatalog ? 200 : 250 }} className="bg-gray-300 animate-pulse">
      {/* Skeleton del header con imagen de fondo */}
      <View className="flex-1 bg-gray-300 relative">
        {/* Logo skeleton superpuesto */}
        <View className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gray-400 rounded-full border-4 border-white" />
      </View>
    </View>
  );

  // Skeleton para ProviderInfo
  const ProviderInfoSkeleton = () => (
    <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 }}>
      {/* Nombre del proveedor */}
      <View className="items-center mb-3">
        <TextSkeleton width="w-48" height="h-6" className="mb-2" />
      </View>
      
      {/* Industria */}
      <View className="flex-row items-center justify-center mb-3">
        <View className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
        <TextSkeleton width="w-32" height="h-4" className="ml-2" />
      </View>
      
      {/* Dirección */}
      <View className="flex-row items-center justify-center mb-4">
        <View className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
        <TextSkeleton width="w-40" height="h-4" className="ml-2" />
      </View>
      
      {/* Tags skeleton */}
      <View className="flex-row flex-wrap justify-center mb-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className="bg-gray-200 px-3 py-1 rounded-full m-1 animate-pulse">
            <TextSkeleton width="w-12" height="h-3" />
          </View>
        ))}
      </View>
    </View>
  );

  // Skeleton para ActionButtons
  const ActionButtonsSkeleton = () => (
    <View className="px-4 pb-4">
      <View className="flex-row justify-center space-x-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className="bg-gray-200 rounded-xl py-3 px-6 flex-row items-center animate-pulse">
            <View className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
            <TextSkeleton width="w-16" height="h-4" className="ml-2" />
          </View>
        ))}
      </View>
    </View>
  );

  // Skeleton para DescriptionSection
  const DescriptionSkeleton = () => (
    <CardContainer>
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center mb-3">
          <View className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
          <TextSkeleton width="w-24" height="h-5" className="ml-2" />
        </View>
      </View>
      <View className="px-4 pb-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <TextSkeleton key={index} width="w-full" height="h-4" className="mb-2" />
        ))}
        <TextSkeleton width="w-3/4" height="h-4" />
      </View>
    </CardContainer>
  );

  // Skeleton para información de contacto
  const ContactInfoSkeleton = () => (
    <CardContainer>
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center mb-3">
          <View className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
          <TextSkeleton width="w-40" height="h-5" className="ml-2" />
        </View>
      </View>
      
      <View className="px-4 pb-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <TextSkeleton width="w-24" height="h-4" />
            <TextSkeleton width="w-32" height="h-4" />
          </View>
        ))}
      </View>
    </CardContainer>
  );

  // Skeleton para productos
  const ProductsSkeleton = () => (
    <CardContainer>
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center mb-3">
          <View className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
          <TextSkeleton width="w-32" height="h-5" className="ml-2" />
        </View>
        <TextSkeleton width="w-24" height="h-3" className="mb-3" />
      </View>
      
      <View className="px-4 pb-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
            <View className="flex-row">
              {/* Imagen del producto */}
              <View className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse" />
              
              {/* Información del producto */}
              <View className="flex-1 ml-4">
                <TextSkeleton width="w-3/4" height="h-4" className="mb-2" />
                <TextSkeleton width="w-full" height="h-3" className="mb-2" />
                <TextSkeleton width="w-1/2" height="h-3" />
              </View>
              
              {/* Precio */}
              <View className="items-end">
                <TextSkeleton width="w-16" height="h-5" />
              </View>
            </View>
          </View>
        ))}
        
        {/* Botón skeleton */}
        <View className="bg-gray-200 rounded-xl py-3 flex-row items-center justify-center animate-pulse">
          <View className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
          <TextSkeleton width="w-32" height="h-4" className="ml-2" />
          <View className="w-5 h-5 bg-gray-300 rounded animate-pulse ml-2" />
        </View>
      </View>
    </CardContainer>
  );

  // ==================== LÓGICA EXISTENTE ====================

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

  // Efecto para filtrar y ordenar productos
  useEffect(() => {
    if (!products?.items) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products.items];

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenar productos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.props.price - b.props.price;
        case 'price-desc':
          return b.props.price - a.props.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  // Función para mostrar catálogo y hacer scroll al inicio
  const showCatalogView = () => {
    setShowCatalog(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

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

  // ==================== RENDERIZADO ====================

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView 
        ref={scrollViewRef}
        className='flex-1' 
        showsVerticalScrollIndicator={false}
      >
        {/* Header con imagen de fondo y logo */}
        {loadingProvider ? (
          <ProviderHeaderSkeleton />
        ) : provider ? (
          <ProviderHeader
            backgroundImage={provider.image}
            logoImage={provider.image}
            providerName={provider.name}
            height={showCatalog ? 200 : 250}
          />
        ) : null}
        
        {showCatalog ? (
          /* ========== VISTA DE CATÁLOGO COMPLETO ========== */
          <CardContainer 
            padding="none" 
            margin="none" 
            style={{ 
              marginTop: -20,
              marginHorizontal: 0,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              zIndex: 1,
            }}
          >
            {/* Información reducida del proveedor */}
            {loadingProvider ? (
              <ProviderInfoSkeleton />
            ) : provider ? (
              <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 }}>
                <Text className='text-2xl font-bold text-gray-900 text-center mb-2'>
                  {provider.name}
                </Text>
                
                <View className='flex-row items-center justify-center mb-3'>
                  <MaterialCommunityIcons name="briefcase" size={16} color="#2563EB" />
                  <Text className='text-base text-blue-600 font-medium ml-2'>
                    {provider.props.industry}
                  </Text>
                </View>
                
                {provider.tags && provider.tags.length > 0 && (
                  <View className='flex-row flex-wrap justify-center mb-4'>
                    {provider.tags.slice(0, 4).map((tag, index) => (
                      <View key={index} className='bg-gray-100 px-3 py-1 rounded-full m-1'>
                        <Text className='text-xs text-gray-700 font-medium'>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  className='bg-gray-200 rounded-xl py-2 flex-row items-center justify-center mb-4'
                  activeOpacity={0.8}
                  onPress={() => setShowCatalog(false)}
                >
                  <MaterialCommunityIcons name="arrow-left" size={16} color="#374151" />
                  <Text className='text-gray-700 font-medium ml-2'>Ver perfil completo</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Componente de filtros */}
            <CatalogFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Catálogo completo de productos */}
            <View className='px-4 pb-4'>
              <Text className='text-lg font-bold text-gray-900 mb-4'>
                {searchQuery.trim() 
                  ? `Resultados para "${searchQuery}" (${filteredProducts.length})`
                  : `Catálogo completo (${filteredProducts.length} productos)`
                }
              </Text>
              
              {loadingProducts ? (
                <View className='py-8'>
                  <ActivityIndicator size="large" color="#2563EB" />
                  <Text className='text-gray-500 text-center mt-4'>Cargando productos...</Text>
                </View>
              ) : filteredProducts.length ? (
                <View>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      variant="list"
                      onPress={(product) => {
                        console.log('Producto seleccionado:', product.name);
                      }}
                    />
                  ))}
                </View>
              ) : (
                <View className='py-8'>
                  <Text className='text-gray-500 text-center'>
                    {searchQuery.trim() 
                      ? `No se encontraron productos que coincidan con "${searchQuery}"`
                      : 'Este proveedor no tiene productos disponibles'
                    }
                  </Text>
                </View>
              )}
            </View>
          </CardContainer>
        ) : (
          /* ========== VISTA DE PERFIL COMPLETO ========== */
          <>
            {/* Contenedor principal con información del proveedor */}
            <CardContainer 
              padding="none" 
              margin="none" 
              style={{ 
                marginTop: -20,
                marginHorizontal: 0,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                zIndex: 1,
              }}
            >
              {loadingProvider ? (
                <ProviderInfoSkeleton />
              ) : provider ? (
                <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 }}>
                  <ProviderInfo
                    name={provider.name}
                    industry={provider.props.industry}
                    address={provider.props.tax_address}
                    tags={provider.tags}
                  />
                </View>
              ) : null}
              
              {/* Botones de acción */}
              {loadingProvider ? (
                <ActionButtonsSkeleton />
              ) : provider ? (
                <ActionButtons 
                  phone={provider.props.phone_number}
                  email={provider.props.email}
                />
              ) : null}
            </CardContainer>

            {/* Descripción */}
            {loadingProvider ? (
              <DescriptionSkeleton />
            ) : provider ? (
              <CardContainer>
                <DescriptionSection
                  title="Descripción"
                  description={provider.description?.trim() || 
                    `${provider.name} es una empresa especializada en ${provider.props.industry.toLowerCase()}. ` +
                    `Ubicada en ${provider.props.tax_address}, ofrecemos productos y servicios de calidad para satisfacer ` +
                    `las necesidades de nuestros clientes. Contamos con amplia experiencia en el sector y un equipo ` +
                    `profesional comprometido con la excelencia.`}
                  maxLines={4}
                />
              </CardContainer>
            ) : null}

            {/* Información de contacto */}
            {loadingProvider ? (
              <ContactInfoSkeleton />
            ) : provider ? (
              <CardContainer>
                <SectionHeader
                  title="Información de Contacto"
                  icon="card-account-details"
                />
                
                <View className='px-4 pb-4'>
                  <View className='flex-row justify-between items-center py-3 border-b border-gray-100'>
                    <Text className='text-gray-600 font-medium'>Razón Social</Text>
                    <Text className='text-gray-900 font-medium flex-1 text-right ml-4' numberOfLines={2}>
                      {provider.props.legal_name}
                    </Text>
                  </View>
                  
                  <View className='flex-row justify-between items-start py-3 border-b border-gray-100'>
                    <Text className='text-gray-600 font-medium'>Dirección</Text>
                    <Text className='text-gray-900 flex-1 text-right ml-4' numberOfLines={3}>
                      {provider.props.tax_address}
                    </Text>
                  </View>
                  
                  <View className='flex-row justify-between items-center py-3'>
                    <Text className='text-gray-600 font-medium'>Rubro</Text>
                    <Text className='text-gray-900 font-medium'>
                      {provider.props.industry}
                    </Text>
                  </View>
                </View>
              </CardContainer>
            ) : null}

            {/* Productos principales */}
            {loadingProvider ? (
              <ProductsSkeleton />
            ) : provider ? (
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
                    <View className='px-4 pb-4'>
                      {products.items.slice(0, 2).map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          variant="list"
                          onPress={(product) => {
                            console.log('Producto seleccionado:', product.name);
                          }}
                        />
                      ))}
                    </View>
                    
                    <View className='px-4 pb-4'>
                      <TouchableOpacity
                        className='bg-blue-600 rounded-xl py-3 flex-row items-center justify-center'
                        activeOpacity={0.8}
                        onPress={() => {
                          console.log('Mostrar catálogo completo del proveedor:', provider.name);
                          showCatalogView();
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
            ) : null}
          </>
        )}

        {/* Espaciado inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProviderDetailScreen;