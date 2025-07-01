import { MaterialCommunityIcons } from '@expo/vector-icons';

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface CustomPopupProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  onClose: () => void;
  buttonText?: string;
}

const { width, height } = Dimensions.get('window');

const CustomPopup: React.FC<CustomPopupProps> = ({
  visible,
  title,
  message,
  type = 'error',
  onClose,
  buttonText = 'Cerrar',
}) => {
    const getIconName = () => {
    switch (type) {
        case 'success':
        return 'check-circle-outline';
        case 'warning':
        return 'alert-outline';
        case 'info':
        return 'information-outline';
        default:
        return 'close-circle-outline';
    }
    };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#0332C7'; 
      case 'warning':
        return '#0D4ED8'; 
      case 'info':
        return '#2563EB'; 
      default:
        return '#1E40AF'; 
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#0332C7';
      case 'warning':
        return '#0D4ED8';
      case 'info':
        return '#2563EB';
      default:
        return '#1E40AF';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      
      {/* Backdrop con blur */}
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(3, 50, 199, 0.2)' }}>
        <BlurView
          intensity={25}
          tint="light"
          className="absolute inset-0"
        />
        
        {/* Popup Container */}
        <View 
          className="bg-white rounded-2xl mx-6 p-6 shadow-2xl border"
          style={{
            maxWidth: width * 0.85,
            borderTopWidth: 4,
            borderTopColor: getBorderColor(),
            borderColor: '#E5E7EB',
            shadowColor: '#0332C7',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Header con icono */}
          <View className="items-center mb-4">
            <View 
              className="w-16 h-16 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: `${getIconColor()}15` }}
            >
                <MaterialCommunityIcons
                    name={getIconName()}
                    size={32}
                    color={getIconColor()}
                />
            </View>
            
            <Text className="text-xl font-bold text-center" style={{ color: '#1F2937' }}>
              {title}
            </Text>
          </View>

          {/* Mensaje */}
          <Text className="text-base text-center mb-6 leading-6" style={{ color: '#4B5563' }}>
            {message}
          </Text>

          {/* Botón de cerrar */}
          <TouchableOpacity
            onPress={onClose}
            className="rounded-xl py-3 px-6 items-center"
            style={{ 
              backgroundColor: getBorderColor(),
              shadowColor: getBorderColor(),
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomPopup;