import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/header';

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  calle: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
  nuevaPassword: string;
}

const EditProfile = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    calle: '',
    ciudad: '',
    codigoPostal: '',
    provincia: '',
    nuevaPassword: '',
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    Alert.alert(
      'Guardar Cambios',
      '¿Estás seguro de que quieres guardar los cambios?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Guardar',
          onPress: () => {
            console.log('Guardando cambios...', formData);
            Alert.alert('Éxito', 'Los cambios se han guardado correctamente');
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const handleEditPhoto = () => {
    Alert.alert('Cambiar Foto', 'Función para cambiar la foto de perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Editar cuenta"
        subtitle="Gestiona tu cuenta y preferencias"
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
          {/* Sección de Información Personal */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Información Personal</Text>
                <View style={styles.sectionDivider} />
              </View>

              {/* Foto de perfil */}
              <TouchableOpacity style={styles.profileImageContainer} onPress={handleEditPhoto}>
                <View style={styles.profileImage}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=U' }}
                    style={styles.profileImageInner}
                  />
                </View>
                <TouchableOpacity style={styles.editPhotoButton} onPress={handleEditPhoto}>
                  <Icon name="camera" size={14} color="#0A1F44" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.nameInput]}
                  placeholder="Nombre"
                  placeholderTextColor="#9CA3AF"
                  value={formData.nombre}
                  onChangeText={(value) => handleInputChange('nombre', value)}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#9CA3AF"
                value={formData.apellido}
                onChangeText={(value) => handleInputChange('apellido', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                placeholderTextColor="#9CA3AF"
                value={formData.telefono}
                onChangeText={(value) => handleInputChange('telefono', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Sección de Seguridad */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Seguridad</Text>
              <View style={styles.sectionDivider} />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Cambiar clave"
                placeholderTextColor="#9CA3AF"
                value={formData.nuevaPassword}
                onChangeText={(value) => handleInputChange('nuevaPassword', value)}
                secureTextEntry
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Activar verificación en dos pasos</Text>
                <Switch
                  value={twoFactorAuth}
                  onValueChange={setTwoFactorAuth}
                  thumbColor={twoFactorAuth ? '#FFFFFF' : '#FFFFFF'}
                  trackColor={{ false: '#E5E7EB', true: '#133A7D' }}
                  style={styles.switch}
                />
              </View>
            </View>
          </View>

          {/* Sección de Dirección */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Dirección</Text>
              <View style={styles.sectionDivider} />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Calle"
                placeholderTextColor="#9CA3AF"
                value={formData.calle}
                onChangeText={(value) => handleInputChange('calle', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Ciudad"
                placeholderTextColor="#9CA3AF"
                value={formData.ciudad}
                onChangeText={(value) => handleInputChange('ciudad', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Código Postal"
                placeholderTextColor="#9CA3AF"
                value={formData.codigoPostal}
                onChangeText={(value) => handleInputChange('codigoPostal', value)}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Provincia"
                placeholderTextColor="#9CA3AF"
                value={formData.provincia}
                onChangeText={(value) => handleInputChange('provincia', value)}
              />
            </View>
          </View>
        </ScrollView>

        {/* Botón Guardar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
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
  sectionHeader: {
    position: 'relative',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  sectionDivider: {
    height: 2,
    backgroundColor: '#E5E7EB',
    width: '60%',
  },
  profileImageContainer: {
    position: 'absolute',
    top: -40,
    right: 0,
    zIndex: 5,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImageInner: {
    width: '100%',
    height: '100%',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
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
  nameInput: {
    flex: 0.7,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter',
    flex: 1,
    marginRight: 16,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A1F44',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  saveButton: {
    backgroundColor: '#133A7D',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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

export default EditProfile;