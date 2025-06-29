import { getCategories, getProviders } from '@/src/utils/querys';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/header';
import SectionCard from '../../../components/SectionCard';
import usefetch from "../../../hooks/useFetch";
import CommerceCard from './components/CommerceCard';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface ResApi<T> {
  path: string;
  method: string;
  error?: any;
  items: T[];
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}
type CategoriesRes = ResApi<Category>;

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

const Index = () => {
  const router = useRouter();
  const { data: categories, execute: fetchCategories, loading: loadingCategories } = usefetch<CategoriesRes>();
  const { data: providers, execute: fetchProviders, loading: loadingProviders } = usefetch<CommercesRes>();

  useEffect(() => {
    fetchCategories({ method: 'post', url: '/api/findObjectsTypes', data: getCategories });
    fetchProviders({ method: 'post', url: '/api/findObjects', data: getProviders });
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-gray-200'>
      <Header title="Joaquin Strusiat" subtitle="¿Qué estás buscando hoy?"></Header>
      <View className='flex-1 px-2'>

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
            {!loadingCategories && categories?.items?.map((item: Category) => (
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


      </View>
    </SafeAreaView>
  );
};

export default Index;