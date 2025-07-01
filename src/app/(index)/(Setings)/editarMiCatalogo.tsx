import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
}

interface Producto {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

const EditarMiCatalogo = () => {
  const { execute: fetchCatalog, loading: loadingCatalog } = useAxios();
  const { execute: saveCatalog, loading: savingCatalog } = useAxios();
  const { execute: fetchProducts, loading: loadingProducts } = useAxios();
  const { getCurrentUser } = useStore();

  const [catalogoData, setCatalogoData] = useState<CatalogoData>({
    userId: '',
    nombreTienda: '',
    descripcion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    referencias: '',
    imagenPortada: '',
    productosSeleccionados: [],
    isPublic: true,
    slug: '',
  });

  const [productos, setProductos] = useState<Producto[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
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

      await loadCatalog(currentUser._id);

      await loadUserProducts(currentUser._id);

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

  const loadUserProducts = async (userId: string) => {
    try {
      const productsQuery = [
        {
          "$match": {
            "userId": userId,
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

      const response = await fetchProducts({
        method: 'post',
        url: '/api/findObjects',
        data: productsQuery,
      });

      if (response?.items) {
        setProductos(response.items);
      }
    } catch (error) {
      console.error('Error loading products:', error);
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

  const catalogoUrl = `https://catalogo.tangoshop.com/${catalogoData.slug || 'usuario'}`;

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: keyof CatalogoData, value: string) => {
    setCatalogoData(prev => {
      const newData = { ...prev, [field]: value };

      if (field === 'nombreTienda' && value) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const handleCopiarUrl = () => {
    Clipboard.setString(catalogoUrl);
    Alert.alert('¡Copiado!', 'La URL de tu catálogo ha sido copiada al portapapeles.');
  };

  const handleSeleccionarImagen = () => {
    setTempImageUrl(catalogoData.imagenPortada);
    setShowImageModal(true);
  };

  const handleConfirmarImagen = () => {
    if (tempImageUrl && tempImageUrl.trim()) {
      handleInputChange('imagenPortada', tempImageUrl.trim());
    } else {
      handleInputChange('imagenPortada', '');
    }
    setShowImageModal(false);
    setTempImageUrl('');
  };

  const handleCancelarImagen = () => {
    setShowImageModal(false);
    setTempImageUrl('');
  };

  const toggleProducto = (productoId: string) => {
    setCatalogoData(prev => {
      const isSelected = prev.productosSeleccionados.includes(productoId);
      const newSelected = isSelected
        ? prev.productosSeleccionados.filter(id => id !== productoId)
        : [...prev.productosSeleccionados, productoId];

      return {
        ...prev,
        productosSeleccionados: newSelected
      };
    });
  };

  const handleGuardar = async () => {
    if (!catalogoData.nombreTienda.trim()) {
      Alert.alert('Error', 'El nombre de la tienda es obligatorio.');
      return;
    }

    if (!catalogoData.telefono.trim() && !catalogoData.email.trim()) {
      Alert.alert('Error', 'Debes proporcionar al menos un teléfono o email de contacto.');
      return;
    }

    try {
      const currentUser = getCurrentUser();
      if (!currentUser?._id) {
        Alert.alert('Error', 'No se encontró información del usuario');
        return;
      }

      const catalogData = {
        ...catalogoData,
        userId: currentUser._id,
        type: 'catalog',
        slug: catalogoData.slug || generateSlug(catalogoData.nombreTienda),
        updatedAt: new Date().toISOString(),
      };

      let response;

      if (catalogoData._id) {
        response = await saveCatalog({
          method: 'post',
          url: `/api/updateObject/${catalogoData._id}`,
          data: catalogData
        });
      } else {
        response = await saveCatalog({
          method: 'post',
          url: '/api/createObject',
          data: {
            ...catalogData,
            createdAt: new Date().toISOString(),
          }
        });
      }

      if (response) {
        Alert.alert(
          '¡Éxito!',
          'Tu catálogo ha sido guardado correctamente.',
          [
            {
              text: 'Ver Catálogo',
              onPress: () => {
                // Aquí podrías abrir el catálogo en un navegador
                console.log('Abrir catálogo:', catalogoUrl);
              }
            },
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error saving catalog:', error);
      Alert.alert('Error', 'No se pudo guardar el catálogo. Inténtalo de nuevo.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Mi Catálogo"
          subtitle="Personaliza tu catálogo público"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Cargando catálogo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Mi Catálogo"
        subtitle="Personaliza tu catálogo público"
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonCircle}>
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Header>

      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tu Catálogo Público</Text>

            <View style={styles.urlContainer}>
              <View style={styles.urlBox}>
                <Text style={styles.urlText}>{catalogoUrl}</Text>
                <TouchableOpacity style={styles.copyButton} onPress={handleCopiarUrl}>
                  <Icon name="copy" size={16} color="#133A7D" />
                </TouchableOpacity>
              </View>
              <Text style={styles.urlNote}>
                Comparte este enlace con tus clientes para que vean tu catálogo
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Modal para URL de imagen */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelarImagen}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Imagen de Portada</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa la URL de la imagen que quieres usar como portada:
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="https://ejemplo.com/imagen.jpg"
              placeholderTextColor="#9CA3AF"
              value={tempImageUrl}
              onChangeText={setTempImageUrl}
              autoCapitalize="none"
              keyboardType="url"
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={handleCancelarImagen}>
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleConfirmarImagen}>
                <Text style={styles.modalButtonConfirmText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1F44',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#0A1F44',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  imageSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  fieldSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  imageUpload: {
    height: 120,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderImage: {
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  removeImageText: {
    fontSize: 14,
    color: '#EF4444',
    fontFamily: 'Inter',
  },
  inputGroup: {
    gap: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '400',
    color: '#374151',
    fontFamily: 'Inter',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  urlPreview: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  urlPreviewText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  productsList: {
    gap: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  productItemSelected: {
    borderColor: '#133A7D',
    backgroundColor: '#EBF4FF',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter',
  },
  productPrice: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  noProductsContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginTop: 16,
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
    fontFamily: 'Inter',
  },
  noProductsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  urlContainer: {
    alignItems: 'center',
  },
  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  urlText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter',
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
  urlNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  saveButton: {
    backgroundColor: '#133A7D',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#133A7D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  modalInput: {
    height: 80,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    fontWeight: '400',
    color: '#374151',
    fontFamily: 'Inter',
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#133A7D',
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});

export default EditarMiCatalogo;