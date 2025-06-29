import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;

}

const Header: React.FC<HeaderProps> = ({ title, subtitle, children, }) => {
  return (
    <ImageBackground
      source={require('../../src/assets/images/bgHeader.jpeg')} // Asegúrate de tener esta imagen
      /* style={styles.backgroundImage} */
      resizeMode="cover"
      blurRadius={20}
      borderBottomRightRadius={20}
      borderBottomLeftRadius={20}
      className='pt-6'
    >

      <View className='p-5'>
        <View>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {children && <View className='mt-4'>{children}</View>}
      </View>
    </ImageBackground>
  );
};

// PropTypes no son necesarios cuando se usa TypeScript con interfaces

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  }
});

export default Header;