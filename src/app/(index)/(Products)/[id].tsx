import { productosEjemplo, proveedoresEjemplo } from '@/src/utils/scripts';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Componente para las estrellas de calificación
const StarRating: React.FC<{ rating: number; maxStars?: number }> = ({ rating, maxStars = 5 }) => {
    return (
        <View style={styles.starsContainer}>
            {[...Array(maxStars)].map((_, index) => (
                <Ionicons
                    key={index}
                    name={index < rating ? "star" : "star-outline"}
                    size={24}
                    color={index < rating ? "#2563EB" : "#D1D5DB"}
                    style={styles.star}
                />
            ))}
        </View>
    );
};

export default function ProductoDetalle() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const producto = productosEjemplo.find((p) => p.id === Number(id));
  const proveedor = proveedoresEjemplo.find((p) => p.id === producto?.sellers_id);

  if (!producto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Producto no encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Contenedor principal del producto */}
        <View style={styles.productCard}>
          {/* Imagen del producto */}
          <View style={styles.imageContainer}>
            <Image
              source={{ 
                uri: producto.imageUri|| 'https://via.placeholder.com/200x300/F3F4F6/6B7280?text=Producto'
              }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>

          {/* Información del producto */}
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{producto.name}</Text>
            
            {/* Calificación */}
            <View style={styles.ratingContainer}>
              <StarRating rating={producto.rating || 4} />
              <Text style={styles.ratingText}>{producto.rating || 4.0}</Text>
            </View>

            {/* Precio */}
            <Text style={styles.price}>
              ${producto.price?.toLocaleString('es-AR') || '0'}
            </Text>

            {/* Información del proveedor */}
            {proveedor && (
              <View style={styles.sellerContainer}>
                <Image
                  source={{ 
                    uri: proveedor.imageUri || `https://via.placeholder.com/60x60/2563EB/FFFFFF?text=${proveedor.name?.charAt(0) || 'P'}`
                  }}
                  style={styles.sellerAvatar}
                />
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{proveedor.name}</Text>
                  
                  {/* Datos de contacto */}
                  <View style={styles.contactInfo}>
                    {proveedor.address && (
                      <View style={styles.contactItem}>
                        <Ionicons name="location-outline" size={16} color="#6B7280" />
                        <Text style={styles.contactText}>{proveedor.address}</Text>
                      </View>
                    )}
                    
                    {proveedor.phone && (
                      <View style={styles.contactItem}>
                        <Ionicons name="call-outline" size={16} color="#6B7280" />
                        <Text style={styles.contactText}>{proveedor.phone}</Text>
                      </View>
                    )}
                    
                    {proveedor.email && (
                      <View style={styles.contactItem}>
                        <Ionicons name="mail-outline" size={16} color="#6B7280" />
                        <Text style={styles.contactText}>{proveedor.email}</Text>
                      </View>
                    )}
                    
                    {proveedor.address && (
                      <View style={styles.contactItem}>
                        <Ionicons name="home-outline" size={16} color="#6B7280" />
                        <Text style={styles.contactText}>{proveedor.address}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* Botón de catálogo completo */}
            <TouchableOpacity style={styles.catalogButton}>
              <Text style={styles.catalogButtonText}>Catálogo completo</Text>
              <Ionicons name="create-outline" size={20} color="white" style={styles.catalogIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Descripción del producto */}
        {producto.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>{producto.description}</Text>
          </View>
        )}

        {/* Información adicional */}
        {producto.category && (
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoTitle}>Información adicional</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoría:</Text>
              <Text style={styles.infoValue}>{producto.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID del producto:</Text>
              <Text style={styles.infoValue}>{producto.id}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E40AF',
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  productCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: '#2563EB',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productImage: {
    width: 200,
    height: 200,
  },
  productInfo: {
    padding: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  sellerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  catalogButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  catalogButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  catalogIcon: {
    marginLeft: 4,
  },
  descriptionContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
  },
  additionalInfoContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  additionalInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
  },
});