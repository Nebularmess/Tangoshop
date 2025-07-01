import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface CatalogoData {
  _id: string;
  userId: string;
  nombreTienda: string;
  descripcion: string;
  telefono: string;
  email: string;
  sitioWeb: string;
  referencias: string;
  imagenPortada: string;
  productosSeleccionados: string[];
  isPublic: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Producto {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

interface UserData {
  _id: string;
  name: string;
  last_name: string;
  email: string;
  image?: string;
}

const { width } = Dimensions.get('window');
const API_BASE_URL = 'https://api.tangoshop.com'; // Cambiado para React Native

export default function MiCatalogo() {
  const [catalogData, setCatalogData] = useState<CatalogoData | null>(null);
  const [products, setProducts] = useState<Producto[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Para demo, usando un slug fijo. En producción, obtendrías esto de los parámetros de navegación
  const slug = 'mi-catalogo-demo';

  useEffect(() => {
    loadCatalogData(slug);
  }, []);

  const loadCatalogData = async (catalogSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      // Buscar catálogo por slug
      const catalogQuery = [
        {
          "$match": {
            "slug": catalogSlug,
            "type": "catalog",
            "isPublic": true
          }
        },
        {
          "$project": {
            "__v": 0
          }
        }
      ];

      const catalogResponse = await fetch(`${API_BASE_URL}/api/findObjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(catalogQuery)
      });

      const catalogResult = await catalogResponse.json();

      if (!catalogResult.items || catalogResult.items.length === 0) {
        setError('Catálogo no encontrado');
        return;
      }

      const catalog = catalogResult.items[0];
      setCatalogData(catalog);

      // Cargar datos del usuario
      await loadUserData(catalog.userId);

      // Cargar productos seleccionados
      if (catalog.productosSeleccionados && catalog.productosSeleccionados.length > 0) {
        await loadProducts(catalog.productosSeleccionados);
      }

    } catch (error) {
      console.error('Error loading catalog:', error);
      setError('Error al cargar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      const userQuery = [
        {
          "$match": {
            "$expr": {
              "$eq": [{ "$toString": "$_id" }, userId]
            }
          }
        },
        {
          "$project": {
            "name": 1,
            "last_name": 1,
            "email": 1,
            "image": 1
          }
        }
      ];

      const userResponse = await fetch(`${API_BASE_URL}/api/findObjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userQuery)
      });

      const userResult = await userResponse.json();
      if (userResult.items && userResult.items.length > 0) {
        setUserData(userResult.items[0]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadProducts = async (productIds: string[]) => {
    try {
      const productsQuery = [
        {
          "$match": {
            "$expr": {
              "$in": [{ "$toString": "$_id" }, productIds]
            },
            "type": "product",
            "status": { "$ne": "deleted" }
          }
        },
        {
          "$project": {
            "name": 1,
            "price": 1,
            "image": 1,
            "description": 1,
            "category": 1
          }
        }
      ];

      const productsResponse = await fetch(`${API_BASE_URL}/api/findObjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productsQuery)
      });

      const productsResult = await productsResponse.json();
      if (productsResult.items) {
        setProducts(productsResult.items);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const getCategories = () => {
    const categories = ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))];
    return categories;
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'Todos') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  };

  const handleContactClick = async (type: 'phone' | 'email' | 'whatsapp') => {
    if (!catalogData) return;

    try {
      switch (type) {
        case 'phone':
          await Linking.openURL(`tel:${catalogData.telefono}`);
          break;
        case 'email':
          await Linking.openURL(`mailto:${catalogData.email}`);
          break;
        case 'whatsapp':
          const whatsappNumber = catalogData.telefono.replace(/[^\d]/g, '');
          const message = `Hola! Vi tu catálogo "${catalogData.nombreTienda}" y me interesa conocer más sobre tus productos.`;
          await Linking.openURL(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la aplicación');
    }
  };

  const handleShare = () => {
    // En React Native, necesitarías usar expo-sharing o react-native-share
    Alert.alert('Compartir', 'Función de compartir disponible próximamente');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderProduct = ({ item: product }: { item: Producto }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        {product.image ? (
          <Image 
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Icon name="eye" size={24} color="#9CA3AF" />
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}
        {product.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.description && (
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
        )}
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          <TouchableOpacity 
            style={styles.consultButton}
            onPress={() => handleContactClick('whatsapp')}
          >
            <Text style={styles.consultButtonText}>Consultar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Cargando catálogo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !catalogData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😞</Text>
          <Text style={styles.errorTitle}>Catálogo no encontrado</Text>
          <Text style={styles.errorMessage}>
            {error || 'El catálogo que buscas no existe o no está disponible públicamente.'}
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categories = getCategories();
  const filteredProducts = getFilteredProducts();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{catalogData.nombreTienda}</Text>
            <Text style={styles.headerSubtitle}>Catálogo de productos</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Icon name="share-2" size={16} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContactClick('whatsapp')}
            >
              <Icon name="message-circle" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Sección de perfil */}
        <View style={styles.profileSection}>
          <View style={styles.profileContent}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              {catalogData.imagenPortada || userData?.image ? (
                <Image
                  source={{ uri: catalogData.imagenPortada || userData?.image || '' }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {catalogData.nombreTienda.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.storeName}>{catalogData.nombreTienda}</Text>
              {userData && (
                <Text style={styles.ownerName}>
                  Por {userData.name} {userData.last_name}
                </Text>
              )}
              {catalogData.descripcion && (
                <Text style={styles.storeDescription}>{catalogData.descripcion}</Text>
              )}

              {/* Información de contacto */}
              <View style={styles.contactInfo}>
                {catalogData.telefono && (
                  <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => handleContactClick('phone')}
                  >
                    <Icon name="phone" size={16} color="#6B7280" />
                    <Text style={styles.contactText}>{catalogData.telefono}</Text>
                  </TouchableOpacity>
                )}
                {catalogData.email && (
                  <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => handleContactClick('email')}
                  >
                    <Icon name="mail" size={16} color="#6B7280" />
                    <Text style={styles.contactText}>{catalogData.email}</Text>
                  </TouchableOpacity>
                )}
                {catalogData.sitioWeb && (
                  <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => Linking.openURL(
                      catalogData.sitioWeb.startsWith('http') 
                        ? catalogData.sitioWeb 
                        : `https://${catalogData.sitioWeb}`
                    )}
                  >
                    <Icon name="globe" size={16} color="#2563EB" />
                    <Text style={[styles.contactText, styles.websiteText]}>Sitio web</Text>
                    <Icon name="external-link" size={12} color="#2563EB" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Referencias adicionales */}
              {catalogData.referencias && (
                <View style={styles.referencesContainer}>
                  <Text style={styles.referencesTitle}>Información adicional</Text>
                  <Text style={styles.referencesText}>{catalogData.referencias}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Sección de productos */}
        <View style={styles.productsSection}>
          <Text style={styles.productsTitle}>
            Productos {products.length > 0 && `(${products.length})`}
          </Text>

          {products.length === 0 ? (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsEmoji}>📦</Text>
              <Text style={styles.noProductsTitle}>No hay productos disponibles</Text>
              <Text style={styles.noProductsMessage}>
                Este catálogo aún no tiene productos publicados.
              </Text>
            </View>
          ) : (
            <>
              {/* Filtro de categorías */}
              {categories.length > 1 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesContainer}
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category || 'Todos')}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category && styles.categoryButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === category && styles.categoryButtonTextActive
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {/* Grid de productos */}
              <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                numColumns={2}
                columnWrapperStyle={styles.productRow}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />

              {filteredProducts.length === 0 && selectedCategory !== 'Todos' && (
                <View style={styles.noCategoryProductsContainer}>
                  <Text style={styles.noCategoryProductsText}>
                    No hay productos en la categoría "{selectedCategory}".
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Catálogo creado con Tango Shop</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  shareButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
  },
  contactButton: {
    backgroundColor: '#16A34A',
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  storeDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
  },
  websiteText: {
    color: '#2563EB',
  },
  referencesContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  referencesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  referencesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  noProductsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noProductsEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noProductsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  noProductsMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 16,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  consultButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  consultButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  noCategoryProductsContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  noCategoryProductsText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});