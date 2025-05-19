import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;

}

const Header: React.FC<HeaderProps> = ({ title, subtitle, children, }) => {
  return (
    <ImageBackground
      source={require('../../src/assets/images/bgHeader.jpeg')} // Asegúrate de tener esta imagen
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={20}
    >
      <SafeAreaView style={[styles.safeArea]}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {children && <View style={styles.childrenContainer}>{children}</View>}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

// PropTypes no son necesarios cuando se usa TypeScript con interfaces

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  container: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 12,
  },
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
  },
  childrenContainer: {
    marginTop: 8,
  },
    backgroundImage: {
    width: '100%',
    paddingTop: 16,
  },
});

export default Header;