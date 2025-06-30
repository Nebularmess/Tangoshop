import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity } from 'react-native';


interface CommerceProps {
    _id: string;
    name: string;
    description: string;
    image: string;
    tags: string[],
    props: {
        legal_name?: string;
        cuit?: string;
        industry?: string;
        tax_address?: string;
        phone_number?: string;
        email?: string;
    };
}

const CommerceCard = ({ commerce }: { commerce: CommerceProps }) => {
  const router = useRouter();

    return (
        <TouchableOpacity 
            className="bg-white rounded-xl border border-gray-300 w-60 p-3 mr-4 shadow-sm"
            onPress={()=> router.navigate(`/(index)/(Providers)/${commerce._id}`)}
            >
            <Image
                source={commerce.image ? { uri: commerce.image } : require("@/src/assets/images/loaderProvider.png")}
                className="w-full h-32 rounded-lg mb-2"
                resizeMode="cover"
            />
            <Text className="text-lg font-bold text-gray-900">
                {commerce.name}
            </Text>
            <Text className="text-xs mb-2" numberOfLines={1}>
                {commerce.props.industry || "No especificado"}
            </Text>
            <Text className="text-sm font-medium text-gray-500 mb-2" numberOfLines={2}>
                {commerce.description || "\n\n"}
            </Text>
            <Text className="text-sm text-gray-800">
                <Icon name="map-marker" size={15} color="black" /> {commerce.props.tax_address || "No especificado"}
            </Text>
            <Text className="text-sm text-gray-800">
                <Icon name="phone" size={16} color="black" /> {commerce.props.phone_number || "No especificado"}
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${commerce.props.email}`)}>
                <Text className="text-sm text-blue-600 underline">
                    <Icon name="email-plus-outline" size={15} color="black" /> {commerce.props.email}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default CommerceCard;

