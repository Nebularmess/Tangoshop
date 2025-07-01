import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ActionButtonsProps {
  phone?: string;
  email?: string;
  website?: string;
  isLoading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  phone,
  email,
  website,
  isLoading = false
}) => {
  // Skeleton para botones
  const ButtonSkeleton: React.FC<{ isFullWidth?: boolean }> = ({ isFullWidth = false }) => (
    <View className={`${isFullWidth ? 'w-full' : 'flex-1'} bg-gray-300 rounded-xl py-4 flex-row items-center justify-center animate-pulse`}>
      <View className="w-5 h-5 bg-gray-400 rounded animate-pulse" />
      <View className="w-16 h-4 bg-gray-400 rounded ml-2 animate-pulse" />
    </View>
  );

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Teléfono no disponible', 'Este proveedor no tiene teléfono registrado.');
    }
  };

  const handleMessage = () => {
    if (phone) {
      Linking.openURL(`https://wa.me/${phone.replace(/[^\d]/g, '')}`);
    } else {
      Alert.alert('WhatsApp no disponible', 'Este proveedor no tiene WhatsApp registrado.');
    }
  };

  const handleEmail = () => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      Alert.alert('Email no disponible', 'Este proveedor no tiene email registrado.');
    }
  };

  if (isLoading) {
    return (
      <View className='px-4 py-3'>
        <View className='flex-row space-x-3'>
          <ButtonSkeleton />
          <ButtonSkeleton />
        </View>
        <View className='mt-3'>
          <ButtonSkeleton isFullWidth />
        </View>
      </View>
    );
  }

  return (
    <View className='px-4 py-3'>
      <View className='flex-row space-x-3'>

        <TouchableOpacity
          onPress={handleCall}
          className='flex-1 bg-blue-600 rounded-xl py-4 flex-row items-center justify-center'
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="phone" size={20} color="white" />
          <Text className='text-white font-bold ml-2'>Llamar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleMessage}
          className='flex-1 bg-blue-600 rounded-xl py-4 flex-row items-center justify-center'
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="message-text" size={20} color="white" />
          <Text className='text-white font-bold ml-2'>Mensaje</Text>
        </TouchableOpacity>
      </View>

      {email && (
        <TouchableOpacity
          onPress={handleEmail}
          className='mt-3 bg-gray-100 rounded-xl py-3 flex-row items-center justify-center'
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="email-outline" size={18} color="#374151" />
          <Text className='text-gray-700 font-medium ml-2'>Enviar Email</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ActionButtons;