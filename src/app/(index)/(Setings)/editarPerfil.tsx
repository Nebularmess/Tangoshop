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

const EditProfile = ({ navigation }: { navigation: any }) => {
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
    navigation.goBack();
  };

  const handleEditPhoto = () => {
    Alert.alert('Cambiar Foto', 'Función para cambiar la foto de perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Configuración"
        subtitle="Gestiona tu cuenta y preferencias"
      />

      {/* Indicador circular */}
      <View style={styles.circleIndicator} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Sección de Información Personal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            {/* Foto de perfil */}
            <TouchableOpacity style={styles.profileImageContainer} onPress={handleEditPhoto}>
              <View style={styles.profileImage}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=Profile' }}
                  style={styles.profileImageInner}
                />
              </View>
              <TouchableOpacity style={styles.editPhotoButton} onPress={handleEditPhoto}>
                <Icon name="camera" size={12} color="#0A1F44" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionDivider} />

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Nombre"
                placeholderTextColor="#2E2E2E"
                value={formData.nombre}
                onChangeText={(value) => handleInputChange('nombre', value)}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#2E2E2E"
              value={formData.apellido}
              onChangeText={(value) => handleInputChange('apellido', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#2E2E2E"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Nro Teléfono"
              placeholderTextColor="#2E2E2E"
              value={formData.telefono}
              onChangeText={(value) => handleInputChange('telefono', value)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Sección de Seguridad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          <View style={styles.sectionDivider} />

          <TextInput
            style={styles.input}
            placeholder="Cambiar clave"
            placeholderTextColor="#2E2E2E"
            value={formData.nuevaPassword}
            onChangeText={(value) => handleInputChange('nuevaPassword', value)}
            secureTextEntry
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Activar verificación en dos pasos</Text>
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              thumbColor={twoFactorAuth ? '#133A7D' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: '#133A7D' }}
            />
          </View>
        </View>

        {/* Sección de Dirección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección</Text>
          <View style={styles.sectionDivider} />

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Calle"
              placeholderTextColor="#2E2E2E"
              value={formData.calle}
              onChangeText={(value) => handleInputChange('calle', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Ciudad"
              placeholderTextColor="#2E2E2E"
              value={formData.ciudad}
              onChangeText={(value) => handleInputChange('ciudad', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Código Postal"
              placeholderTextColor="#2E2E2E"
              value={formData.codigoPostal}
              onChangeText={(value) => handleInputChange('codigoPostal', value)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Provincia"
              placeholderTextColor="#2E2E2E"
              value={formData.provincia}
              onChangeText={(value) => handleInputChange('provincia', value)}
            />
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1F44',
  },
  backButton: {
    marginRight: 20,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(3, 50, 199, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  circleIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
    left: '50%',
    marginLeft: -10,
    top: 30,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#0A1F44',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 23,
    marginBottom: 17,
    borderRadius: 10,
    padding: 14,
    position: 'relative',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1B263B',
    fontFamily: 'Inter',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginTop: -44, // Para posicionar la imagen como en el diseño
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  profileImageInner: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 25,
    height: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#0A1F44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#1B263B',
    marginBottom: 7,
    width: '94%',
  },
  inputGroup: {
    gap: 5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    height: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: 'rgba(27, 38, 59, 0.8)',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: '300',
    color: '#2E2E2E',
    fontFamily: 'Inter',
  },
  halfInput: {
    flex: 0.75, // Para que el campo nombre sea más pequeño como en el diseño
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingRight: 5,
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: '300',
    color: '#1B263B',
    fontFamily: 'Inter',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#133A7D',
    height: 47,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});

export default EditProfile;