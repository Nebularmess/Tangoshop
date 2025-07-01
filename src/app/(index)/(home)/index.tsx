import useStore from '@/src/hooks/useStorage';
import { getCategories, getProducts, getProviders } from '@/src/utils/querys';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import Header from '../../../components/header';
import SectionCard from '../../../components/SectionCard';
import usefetch from "../../../hooks/useFetch";
import CommerceCard from './components/CommerceCard';
import ProductCard from './components/ProductCard';

const loaderProduct = {
  "_id": "1",
  "name": "Cargando nombre...",
  "description": "Cargando descripcion...",
  "type": "Cargando tipo...",
  "tags": [],
  "props": {
    "price": 0,
    "images": []
  },
  "categorie": "Cargando categoria...",
}

interface ResApi<T> {
  path: string;
  method: string;
  error?: any;
  items: T[];
}

interface CategoryProps {
  _id: string;
  name: string;
  description: string;
  image: string;
}
type CategoriesRes = ResApi<CategoryProps>;

interface CommerceProps {
  _id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  props: {
    legal_name?: string;
    cuit?: string;
    industry?: string;
    tax_address?: string;
    phone_number?: string;
    email?: string;
  };
}
type CommercesRes = ResApi<CommerceProps>;

interface ProductProps {
  _id: string;
  name: string;
  description: string;
  categorie: string;
  type: string;
  tags: string[];
  props: {
    price: number;
    images: string[];
  };
  saved_product: { _id: string }[];
}
type ProductsRes = ResApi<ProductProps>;


const Index = () => {
  const router = useRouter();
  const { get } = useStore();
  const currentUser = get().currentUser

  const [refreshing, setRefreshing] = useState(false);
  const { data: categories, execute: fetchCategories, loading: loadingCategories } = usefetch<CategoriesRes>();
  const { data: providers, execute: fetchProviders, loading: loadingProviders } = usefetch<CommercesRes>();
  const { data: products, execute: fetchProducts, loading: loadingProducts } = usefetch<ProductsRes>();

  useEffect(() => {
    if (!currentUser) return;
    fetchCategories({ method: 'post', url: '/api/findObjectsTypes', data: getCategories });
    fetchProviders({ method: 'post', url: '/api/findObjects', data: getProviders });
    fetchProducts({ method: 'post', url: '/api/findObjects', data: getProducts(currentUser._id) });
  }, [])

  const onRefresh = async () => {
    if (!currentUser) return;
    setRefreshing(true);
    try {
      await Promise.all([
        fetchCategories({ method: 'post', url: '/api/findObjectsTypes', data: getCategories }),
        fetchProviders({ method: 'post', url: '/api/findObjects', data: getProviders }),
        fetchProducts({ method: 'post', url: '/api/findObjects', data: getProducts(currentUser._id) })
      ]);
    } catch (err) {
      console.error("Error al recargar datos", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-200'>
      <Header title={`${currentUser?.name} ${currentUser?.last_name}`} subtitle="¿Qué estás buscando hoy?"></Header>
      <ScrollView className='flex-1 px-2' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

        {/* Section Categories */}
        <SectionCard title="Categorías Principales" redirect="/(index)/(Products)">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            className='pb-2'
          >
            {loadingCategories && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    className='bg-white rounded-lg p-2 mr-3 border border-gray-300'
                    style={{ width: 100 }}
                  >
                    <Image
                      source={require("@/src/assets/images/loaderCategory.png")}
                      className='w-full rounded-md mb-2'
                      style={{ height: 80 }}
                      resizeMode='contain'
                    />
                    <Text
                      className='text-gray-800 font-semibold text-center text-sm'
                      numberOfLines={1}
                    >
                      cargando...
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {!loadingCategories && categories?.items?.map((item: CategoryProps) => (
              <TouchableOpacity
                key={item._id}
                className='bg-white rounded-lg p-2 mr-3 border border-gray-300'
                style={{ width: 100 }} // Ancho fijo para cada card
              /* onPress={() => router.push(`/category/${item._id}`)} */
              >
                <Image
                  source={{ uri: item.image }}
                  className='w-full aspect-square rounded-md mb-2'
                />
                <Text
                  className='text-gray-800 font-semibold text-center text-sm'
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SectionCard>

        {/* Section providers */}
        <SectionCard title='Proovedores destacados' redirect={"/(index)/(Providers)"}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            className="pb-2"
          >
            {loadingProviders && (
              <>
                {Array.from({ length: 2 }).map((_, index) => (
                  <CommerceCard
                    key={index}
                    commerce={{
                      _id: "1",
                      name: "Cargando nombre...",
                      description: "Cargando descripcion...",
                      image: "",
                      tags: [],
                      props: {
                        industry: "Cargando industria...",
                        tax_address: "Cargando direccion...",
                        phone_number: "Cargando telefono...",
                        email: "Cargando email..."
                      }
                    }}
                  />
                ))}
              </>
            )}
            {!loadingProviders && providers?.items?.map((commerce) => (
              <CommerceCard key={commerce._id} commerce={commerce} />
            ))}
          </ScrollView>

        </SectionCard>

        {/* Section Products */}
        <SectionCard title='Productos principales' redirect={"/(index)/(Products)"}>
          {loadingProducts && (
            <>
              <ProductCard product={loaderProduct} />
              <ProductCard product={loaderProduct} />
            </>
          )}
          {!loadingProducts && products?.items?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {/* <ProductCard product={product}></ProductCard> */}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;