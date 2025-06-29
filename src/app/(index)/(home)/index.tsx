import { getCategories } from '@/src/utils/querys';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (CARD_MARGIN * 5)) / 4; // 2 columnas con márgenes

const Index = () => {
  const router = useRouter();
  const { data: res, execute: fetchCategories, error, loading } = usefetch<resApi>();

  useEffect(() => {
    fetchCategories({ method: 'post', url: '/api/findObjectsTypes', data: getCategories })
  }, [fetchCategories])

  return (
    <SafeAreaView className='flex-1 bg-gray-200'>
      <Header title="Joaquin Strusiat" subtitle="¿Qué estás buscando hoy?"></Header>
      <View className='flex-1 px-2 mt-2'>
        <SectionCard title="Categorías Principales" redirect="/(index)/(Products)">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            className='pb-2'
          >
            {res?.items?.map((item: Category) => (
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

      </View>
    </SafeAreaView>
  );
};

export default Index;