
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
}

const CardContainer: React.FC<CardContainerProps> = ({ 
  children, 
  style,
  padding = 'medium',
  margin = 'medium'
}) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'none': return '';
      case 'small': return 'p-2';
      case 'medium': return 'p-4';
      case 'large': return 'p-6';
      default: return 'p-4';
    }
  };

  const getMarginClass = () => {
    switch (margin) {
      case 'none': return '';
      case 'small': return 'm-2';
      case 'medium': return 'm-4';
      case 'large': return 'm-6';
      default: return 'm-4';
    }
  };

  return (
    <View 
      className={`bg-white rounded-2xl border border-gray-100 ${getPaddingClass()} ${getMarginClass()}`}
      style={[
        {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

export default CardContainer;