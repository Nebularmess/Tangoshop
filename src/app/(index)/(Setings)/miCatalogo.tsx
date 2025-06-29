import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Clipboard,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/header';

interface CatalogoData {
  nombreTienda: string;
  descripcion: string;
  telefono: string;
  email: string;
  sitioWeb: string;
  referencias: string;
  imagenPortada: string;
}

interface Producto {
  id: string;
  nombre: string;
  precio: string;
  imagen: string;
  seleccionado: boolean;
}

interface Categoria {
  id: string;
  nombre: string;
  seleccionada: boolean;
}

const MiCatalogo = () => {
  const [catalogoData, setCatalogoData] = useState<CatalogoData>({
    nombreTienda: '',
    descripcion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    referencias: '',
    imagenPortada: '',
  });

  const [productos] = useState<Producto[]>([

  ]);

  const [categorias, setCategorias] = useState<Categoria[]>([

  ]);

  const [productosSeleccionados, setProductosSeleccionados] = useState<Producto[]>(
    productos.filter(p => p.seleccionado)
  );

  const catalogoUrl = `https://plataforma.com/catalogo/${catalogoData.nombreTienda.toLowerCase().replace(/\s+/g, '-') || 'usuario'}`;

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: keyof CatalogoData, value: string) => {
    setCatalogoData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCopiarUrl = () => {
    Clipboard.setString(catalogoUrl);
    Alert.alert('¡Copiado!', 'La URL de tu catálogo ha sido copiada al portapapeles.');
  };

  const handleSeleccionarImagen = () => {
    Alert.prompt(
      'Imagen de Portada',
      'Ingresa la URL de la imagen que quieres usar como portada:',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Agregar',
          onPress: (url) => {
            if (url && url.trim()) {
              handleInputChange('imagenPortada', url.trim());
            }
          },
        },
      ],
      'plain-text',
      catalogoData.imagenPortada
    );
  };

  const toggleCategoria = (categoriaId: string) => {
    setCategorias(prev =>
      prev.map(cat =>
        cat.id === categoriaId
          ? { ...cat, seleccionada: !cat.seleccionada }
          : cat
      )
    );
  };

  const toggleProducto = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
      setProductosSeleccionados(prev => {
        const yaSeleccionado = prev.find(p => p.id === productoId);
        if (yaSeleccionado) {
          return prev.filter(p => p.id !== productoId);
        } else {
          return [...prev, producto];
        }
      });
    }
  };

  const handleGuardar = () => {
    if (!catalogoData.nombreTienda.trim()) {
      Alert.alert('Error', 'El nombre de la tienda es obligatorio.');
      return;
    }

    Alert.alert(
      'Catálogo Guardado',
      '¡Tu catálogo ha sido actualizado exitosamente!',
      [
        {
          text: 'OK',
          onPress: () => console.log('Catálogo guardado:', catalogoData),
        },
      ]
    );
  };

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
          {/* Sección 1: Formulario de Configuración */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuración del Catálogo</Text>
            
            {/* Imagen de Portada */}
            <View style={styles.imageSection}>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Imagen de Portada (Opcional)</Text>
                <TouchableOpacity 
                  style={styles.imageUpload}
                  onPress={handleSeleccionarImagen}
                >
                  {catalogoData.imagenPortada ? (
                    <Image 
                      source={{ uri: catalogoData.imagenPortada }} 
                      style={styles.uploadedImage}
                      onError={() => {
                        Alert.alert('Error', 'No se pudo cargar la imagen. Verifica que la URL sea válida.');
                        handleInputChange('imagenPortada', '');
                      }}
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Icon name="image" size={32} color="#9CA3AF" />
                      <Text style={styles.placeholderText}>Toca para agregar URL de imagen</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {catalogoData.imagenPortada && (
                  <TouchableOpacity 
                    style={styles.removeImageButton} 
                    onPress={() => handleInputChange('imagenPortada', '')}
                  >
                    <Text style={styles.removeImageText}>Quitar imagen</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Campos de texto */}
            <View style={styles.inputGroup}>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Título del Catálogo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Ferretería de Juan"
                  placeholderTextColor="#9CA3AF"
                  value={catalogoData.nombreTienda}
                  onChangeText={(value) => handleInputChange('nombreTienda', value)}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Descripción Breve (Opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe tu negocio en pocas palabras..."
                  placeholderTextColor="#9CA3AF"
                  value={catalogoData.descripcion}
                  onChangeText={(value) => handleInputChange('descripcion', value)}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Número de Contacto</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+54 9 11 1234-5678"
                  placeholderTextColor="#9CA3AF"
                  value={catalogoData.telefono}
                  onChangeText={(value) => handleInputChange('telefono', value)}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="contacto@mineogcio.com"
                  placeholderTextColor="#9CA3AF"
                  value={catalogoData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Sitio Web (Opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="www.mipagina.com"
                  placeholderTextColor="#9CA3AF"
                  value={catalogoData.sitioWeb}
                  onChangeText={(value) => handleInputChange('sitioWeb', value)}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Referencias (Opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Información adicional, horarios de atención, ubicación, etc..."
                  placeholderTextColor="#9CA3AF"
                  value={catalogoData.referencias}
                  onChangeText={(value) => handleInputChange('referencias', value)}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Selección de Productos */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Mis Productos</Text>
              <Text style={styles.fieldSubtitle}>Selecciona los productos que quieres mostrar</Text>
              <View style={styles.productsList}>
                {productos.map((producto) => (
                  <TouchableOpacity
                    key={producto.id}
                    style={[
                      styles.productItem,
                      productosSeleccionados.find(p => p.id === producto.id) && styles.productItemSelected
                    ]}
                    onPress={() => toggleProducto(producto.id)}
                  >
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{producto.nombre}</Text>
                      <Text style={styles.productPrice}>{producto.precio}</Text>
                    </View>
                    <Icon 
                      name={productosSeleccionados.find(p => p.id === producto.id) ? "check-circle" : "circle"} 
                      size={20} 
                      color={productosSeleccionados.find(p => p.id === producto.id) ? "#133A7D" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Sección 2: URL del Catálogo */}
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

          {/* Botón Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            <Text style={styles.saveButtonText}>Guardar Catálogo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1F44',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    marginRight: 10,
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
    height: 100,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadSmall: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    alignItems: 'center',
  },
  placeholderImageSmall: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadedImageSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
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
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  categoryChipSelected: {
    borderColor: '#133A7D',
    backgroundColor: '#133A7D',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  urlContainer: {
    alignItems: 'center',
  },
  urlLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#059669',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Inter',
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
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});

export default MiCatalogo;