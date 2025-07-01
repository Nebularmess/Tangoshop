import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Linking,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/header';
import useAxios from '../../../hooks/useFetch';
import useStore from '../../../hooks/useStorage';

interface CatalogoData {
  _id?: string;
  userId: string;
  isPublic: boolean;
  slug: string;
}

const EditarMiCatalogo = () => {
  const { execute: fetchCatalog, loading: loadingCatalog } = useAxios();
  const { getCurrentUser } = useStore();

  const [catalogoData, setCatalogoData] = useState<CatalogoData>({
    userId: '',
    isPublic: true,
    slug: '',
  });

  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const currentUser = getCurrentUser();

      if (!currentUser?._id) {
        Alert.alert('Error', 'No se encontró información del usuario');
        router.back();
        return;
      }

      // Establecer el email del usuario
      setUserEmail(currentUser.email || '');

      await loadCatalog(currentUser._id);

    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCatalog = async (userId: string) => {
    try {
      const catalogQuery = [
        {
          "$match": {
            "userId": userId,
            "type": "catalog"
          }
        },
        {
          "$project": {
            "createdAt": 0,
            "updatedAt": 0,
            "__v": 0
          }
        }
      ];

      const response = await fetchCatalog({
        method: 'post',
        url: '/api/findObjects',
        data: catalogQuery,
      });

      if (response?.items && response.items.length > 0) {
        const catalog = response.items[0];
        setCatalogoData({
          ...catalog,
          productosSeleccionados: catalog.productosSeleccionados || [],
        });
      } else {
        const user = getCurrentUser();
        setCatalogoData(prev => ({
          ...prev,
          userId: userId,
          email: user?.email || '',
          slug: generateSlug(user?.name || 'usuario'),
        }));
      }
    } catch (error) {
      console.error('Error loading catalog:', error);
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // URL del catálogo con email como parámetro
  const catalogoUrl = `https://tangoshop.up.railway.app/catalogo?email=${encodeURIComponent(userEmail)}`;

  const handleBack = () => {
    router.back();
  };

  const handleCopiarUrl = () => {
    Clipboard.setString(catalogoUrl);
    Alert.alert('¡Copiado!', 'La URL de tu catálogo ha sido copiada al portapapeles.');
  };

  const handleAbrirEnNavegador = async () => {
    try {
      const supported = await Linking.canOpenURL(catalogoUrl);
      if (supported) {
        await Linking.openURL(catalogoUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir el enlace en el navegador');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Ocurrió un error al intentar abrir el enlace');
    }
  };

  const handleCompartir = async () => {
    try {
      const message = `¡Mira mi catálogo de productos!\n\n${catalogoUrl}`;
      
      const result = await Share.share({
        message: message,
        url: catalogoUrl, 
        title: 'Mi Catálogo de Productos'
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Compartido con:', result.activityType);
        } else {
          console.log('Compartido exitosamente');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Compartir cancelado');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'No se pudo compartir el catálogo');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header
            title="Mi Catálogo"
            subtitle="Personaliza tu catálogo público"
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cargando catálogo...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Mi Catálogo"
          subtitle="Personaliza tu catálogo público"
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
        </Header>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Sección URL del Catálogo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enlace</Text>

            <View style={styles.urlContainer}>
              {/* URL Display */}
              <View style={styles.urlBox}>
                <Text style={styles.urlText} numberOfLines={2}>{catalogoUrl}</Text>
                <TouchableOpacity style={styles.copyButton} onPress={handleCopiarUrl}>
                  <Icon name="copy" size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>

              {/* Botones de Acción */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleAbrirEnNavegador}>
                  <Icon name="external-link" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Abrir</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleCompartir}>
                  <Icon name="share-2" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Compartir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Información del Usuario */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Catálogo</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Icon name="mail" size={16} color="#8E8E93" />
                <Text style={styles.infoLabel}>Email asociado:</Text>
                <Text style={styles.infoValue}>{userEmail}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Icon name="globe" size={16} color="#8E8E93" />
                <Text style={styles.infoLabel}>Estado:</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: catalogoData.isPublic ? '#34C759' : '#FF3B30' }]} />
                  <Text style={styles.infoValue}>
                    {catalogoData.isPublic ? 'Público' : 'Privado'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Instrucciones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Cómo usar tu catálogo?</Text>
            
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>1</Text>
                </View>
                <Text style={styles.instructionText}>
                  Agregá productos a tus favoritos desde la sección de productos
                </Text>
              </View>

              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>2</Text>
                </View>
                <Text style={styles.instructionText}>
                  Los productos favoritos aparecerán automáticamente en tu catálogo público
                </Text>
              </View>

              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>3</Text>
                </View>
                <Text style={styles.instructionText}>
                  Podés ajustar el sobreprecio (porcentual o fijo) para cada producto
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>4</Text>
                </View>
                <Text style={styles.instructionText}>
                  Comparte el enlace con tus clientes o ábrelo en el navegador para verlo
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  urlContainer: {
    alignItems: 'center',
  },
  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  urlText: {
    flex: 1,
    fontSize: 13,
    color: '#1C1C1E',
    lineHeight: 16,
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
  urlNote: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonSecondaryText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  instructionsContainer: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  instructionNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
});

export default EditarMiCatalogo;