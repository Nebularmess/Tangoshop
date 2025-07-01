import useFetch from '@/src/hooks/useFetch';
import useStore from '@/src/hooks/useStorage';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
    product: {
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
        saved_product?: { _id: string }[];
    };
}

interface ResApi {
    path: string;
    method: string;
    error?: any;
    item?: any;
}

const ProductCard: React.FC<{ product: ProductCardProps['product'] }> = ({ product }) => {
    const router = useRouter();
    const { get } = useStore();
    const currentUser = get().currentUser;
    const { execute, error } = useFetch<ResApi>();

    const [isSaved, setIsSaved] = useState((product.saved_product || []).length > 0);
    const [savedId, setSavedId] = useState(product.saved_product?.[0]?._id || '');

    const relation = {
        type: "saved_product",
        from: currentUser._id,
        to: product._id,
        tags: [currentUser.email],
        props: {
            type_of_profit: "mount",
            value: 0,
        },
    };

    const handleToggleFavorite = async () => {
        if (!isSaved) {
            const result = await execute({
                method: 'post',
                url: '/api/createRelation',
                data: relation,
            });
            if (result?.item?._id) {
                setIsSaved(true);
                setSavedId(result.item._id);
            } else {
                console.log("No se pudo guardar el producto:", error);
            }
        } else if (savedId) {
            const result = await execute({
                method: 'delete',
                url: `/api/deleteRelation/${savedId}`,
                data: {},
            });
            if (result?.item?._id) {
                setIsSaved(false);
                setSavedId('');
            } else {
                console.log("No se pudo eliminar el producto:", error);
            }
        }
    };

    const navigateTo = () => {
        router.push(`/(index)/(Products)/${product._id}`); //products/
    };

    return (
        <TouchableOpacity className="flex-row bg-white rounded-xl p-2 m-2 shadow-lg" onPress={navigateTo}>
            {/* Imagen */}
            <Image
                source={
                    product.props?.images?.[0]
                        ? { uri: product.props.images[0] }
                        : require('@/src/assets/images/loaderProduct.png')
                }
                className="w-28 h-28 rounded-lg"
                resizeMode="cover"
            />

            {/* Info */}
            <View className="flex-1 pl-3 justify-between">
                <View>
                    <Text className="text-gray-500 text-sm">{product.categorie}</Text>
                    <Text className="text-black text-lg font-semibold" numberOfLines={1}>
                        {product.name}
                    </Text>
                    <Text className="text-gray-700 text-sm" numberOfLines={2}>
                        {product.description}
                    </Text>
                </View>

                <Text className="text-black text-lg font-bold mt-1">
                    ${product.props.price.toLocaleString("es-AR")}
                </Text>
            </View>

            {/* Corazón */}
            <TouchableOpacity onPress={handleToggleFavorite} className="absolute top-2 right-2">
                <Icon
                    name={isSaved ? "heart" : "heart-outline"}
                    size={24}
                    color="black"
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default ProductCard;

