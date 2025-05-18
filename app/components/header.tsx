import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  backgroundColor?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, children, backgroundColor }) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: backgroundColor || '#0066CC' }]}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {children && <View style={styles.childrenContainer}>{children}</View>}
      </View>
    </SafeAreaView>
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
});

export default Header;