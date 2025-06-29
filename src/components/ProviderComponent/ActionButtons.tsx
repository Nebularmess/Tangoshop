import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ActionButtonsProps {
  phone?: string;
  email?: string;
  website?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  phone,
  email,
  website
}) => {
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

  return (
    <View className='px-4 py-3'>
      <View className='flex-row space-x-3'>
        {/* Botón Llamar - AZUL */}
        <TouchableOpacity
          onPress={handleCall}
          className='flex-1 bg-blue-600 rounded-xl py-4 flex-row items-center justify-center'
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="phone" size={20} color="white" />
          <Text className='text-white font-bold ml-2'>Llamar</Text>
        </TouchableOpacity>

        {/* Botón Mensaje - AZUL (era verde) */}
        <TouchableOpacity
          onPress={handleMessage}
          className='flex-1 bg-blue-600 rounded-xl py-4 flex-row items-center justify-center'
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="message-text" size={20} color="white" />
          <Text className='text-white font-bold ml-2'>Mensaje</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Email (opcional, más pequeño) */}
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