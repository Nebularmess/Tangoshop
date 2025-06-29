import { getCategories } from '@/src/utils/querys';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/header';
import SectionCard from '../../../components/SectionCard';
import usefetch from "../../../hooks/useFetch";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface resApi {
  path: string;
  method: string;
  error?: any;
  items: Category[];
}

const Index = () => {
  const router = useRouter();
  const { data: categories, execute: fetchCategories, loading: loadingCategories } = usefetch<resApi>();

  useEffect(() => {
    fetchCategories({ method: 'post', url: '/api/findObjectsTypes', data: getCategories })
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

        <SectionCard title='Proovedores destacados'>

        </SectionCard>


      </View>
    </SafeAreaView>
  );
};

export default Index;