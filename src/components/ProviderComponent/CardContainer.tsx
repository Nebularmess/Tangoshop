import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

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
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return 8;
      case 'medium': return 16;
      case 'large': return 24;
      default: return 16;
    }
  };

  const getMarginStyle = () => {
    switch (margin) {
      case 'none': return 0;
      case 'small': return 8;
      case 'medium': return 16;
      case 'large': return 24;
      default: return 16;
    }
  };

  return (
    <View 
      style={[
        styles.container,
        {
          padding: getPaddingStyle(),
          margin: getMarginStyle(),
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CardContainer;