import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ProviderHeaderProps {
  backgroundImage: string;
  logoImage: string;
  providerName: string;
  height?: number;
}

const { width } = Dimensions.get('window');

const ProviderHeader: React.FC<ProviderHeaderProps> = ({
  backgroundImage,
  logoImage,
  providerName,
  height = 250
}) => {
  const router = useRouter();

  return (
    <View style={[styles.container, { height }]}>
      <Image
        source={{ uri: backgroundImage }}
        style={styles.backgroundImage}
        resizeMode='cover'
      />
      
      <View style={styles.overlay} />
      
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.shareButton}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="share-variant" size={24} color="#374151" />
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: logoImage }}
          style={styles.logo}
          resizeMode='cover'
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  shareButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  logoContainer: {
    position: 'absolute',
    left: 24,
    bottom: -40,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: 'white',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
});

export default ProviderHeader;