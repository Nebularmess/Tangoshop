import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProviderCardProps {
  id?: number; // Modificado: ahora es number en lugar de string
  imageUri: string;
  name: string;
  rating?: number;
  category?: string;
  subcategory?: string;
  description?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  onPress?: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  imageUri,
  name,
  rating = 0,
  category,
  subcategory,
  description,
  city,
  address,
  phone,
  email,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Rating Badge */}
      {rating > 0 && (
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      )}
      
      {/* Información principal */}
      <View style={styles.headerRow}>
        <Image source={{ uri: imageUri }} style={styles.avatar} />
        
        <View style={styles.mainInfo}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          
          {/* Descripción/Categoría principal */}
          {description && (
            <Text style={styles.description} numberOfLines={1}>{description}</Text>
          )}

          {/* Categoría y subcategoría */}
          {(category || subcategory) && (
            <View style={styles.categoryContainer}>
              {category && (
                <Text style={styles.categoryText}>{category}</Text>
              )}
              {category && subcategory && (
                <Text style={styles.bulletPoint}>•</Text>
              )}
              {subcategory && (
                <Text style={styles.categoryText}>{subcategory}</Text>
              )}
            </View>
          )}
        </View>
      </View>
      
      {/* Información de contacto */}
      <View style={styles.contactInfo}>
        {/* Ciudad y Dirección */}
        {(city || address) && (
          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.contactText} numberOfLines={1}>
              {city && address ? `${city}, ${address}` : city || address}
            </Text>
          </View>
        )}
        
        {/* Teléfono */}
        {phone && (
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.contactText} numberOfLines={1}>{phone}</Text>
          </View>
        )}
        
        {/* Email */}
        {email && (
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.contactText} numberOfLines={1}>{email}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#777',
  },
  bulletPoint: {
    fontSize: 12,
    color: '#777',
    paddingHorizontal: 4,
  },
  contactInfo: {
    marginTop: 8,
    paddingLeft: 58, // Alineado con el texto después del avatar
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    marginLeft: 8, // Espacio entre el icono y el texto
  },
});

export default ProviderCard;