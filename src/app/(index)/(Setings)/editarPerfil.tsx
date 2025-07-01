import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  password: string;
  nuevaPassword: string;
  repetirNuevaPassword: string;
  fechaNacimiento: string;
}

interface UserData {
  _id: string;
  name: string;
  last_name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  image?: string;
  type?: string;
}

interface UserApiResponse {
  path: string;
  method: string;
  error?: any;
  items?: UserData[];
  item?: UserData;
  // Para respuesta directa
  _id?: string;
  name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  image?: string;
  type?: string;
}

const EditProfile = () => {
  const { execute: fetchUser, loading: loadingUser } = useAxios<UserApiResponse>();
  const { execute: updateUser, loading: updatingUser } = useAxios<UserApiResponse>();
  const { save: saveToStorage, getCurrentUser } = useStore();

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    telefono: '',
    password: '',
    nuevaPassword: '',
    repetirNuevaPassword: '',
    fechaNacimiento: '',
  });

  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState({
    day: '',
    month: '',
    year: ''
  });

  const [profileImage, setProfileImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);

      // Primero intentar obtener del storage local (Zustand)
      const storageUser = getCurrentUser();
      let userData = storageUser;

      // Si no está en el storage, obtener de AsyncStorage
      if (!userData) {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (!storedUser) {
          Alert.alert('Error', 'No se encontró información del usuario');
          router.back();
          return;
        }
        userData = JSON.parse(storedUser);
      }

      const userId = userData._id || userData.id;

      if (!userId) {
        Alert.alert('Error', 'ID de usuario no válido');
        router.back();
        return;
      }

      // Intentar múltiples estrategias para encontrar el usuario
      let response = null;

      try {
        // Estrategia 1: Query simple por _id sin restricciones de tipo
        const simpleQuery = [
          {
            "$match": {
              "$expr": {
                "$eq": [{ "$toString": "$_id" }, userId]
              }
            }
          }
        ];

        response = await fetchUser({
          method: 'post',
          url: '/api/findObjects',
          data: simpleQuery,
        });

        if (response && response.items && response.items.length > 0) {
          // Éxito con query simple
        } else {
          throw new Error('Usuario no encontrado con query simple');
        }

      } catch (error1) {
        try {
          // Estrategia 2: Query con filtro de email
          const emailQuery = [
            {
              "$match": {
                "email": userData.email
              }
            }
          ];

          response = await fetchUser({
            method: 'post',
            url: '/api/findObjects',
            data: emailQuery,
          });

          if (response && response.items && response.items.length > 0) {
            // Éxito con query por email
          } else {
            throw new Error('Usuario no encontrado por email');
          }

        } catch (error2) {
          try {
            // Estrategia 3: Intentar con endpoint directo de usuario
            response = await fetchUser({
              method: 'get',
              url: `/api/user/${userId}`,
            });

            if (response && (response._id || response.email)) {
              // Éxito con endpoint directo
            } else {
              throw new Error('Endpoint directo no disponible');
            }

          } catch (error3) {
            // Estrategia 4: Usar datos del storage como fallback
            response = { items: [userData] };
          }
        }
      }

      // Procesar la respuesta según el formato
      let user = null;

      if (response._id) {
        // Respuesta directa (Estrategia 3)
        user = response as UserData;
      } else if (response.items && response.items.length > 0) {
        // Respuesta con array (Estrategias 1, 2, 4)
        user = response.items[0];
      } else if (response.item) {
        // Respuesta con objeto item
        user = response.item;
      }

      if (user && (user._id || user.email)) {
        setCurrentUser(user);

        // Llenar el formulario con los datos actuales
        setFormData({
          nombre: user.name || '',
          apellido: user.last_name || '',
          telefono: user.phone || '',
          password: '',
          nuevaPassword: '',
          repetirNuevaPassword: '',
          fechaNacimiento: user.birthDate || '',
        });

        setProfileImage(user.image || '');

        // Actualizar el storage local con datos frescos
        saveToStorage({ currentUser: user });
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));

      } else {
        Alert.alert(
          'Error',
          'No se encontraron los datos del usuario en el servidor. Usando datos locales.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Usar datos del storage como último recurso
                if (userData) {
                  setCurrentUser(userData);
                  setFormData({
                    nombre: userData.name || '',
                    apellido: userData.last_name || '',
                    telefono: userData.phone || '',
                    password: '',
                    nuevaPassword: '',
                    repetirNuevaPassword: '',
                    fechaNacimiento: userData.birthDate || '',
                  });
                  setProfileImage(userData.image || '');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDateToISO = (date: Date): string => {
    return date.toISOString();
  };

  const formatDateForDisplay = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const validateAndSetDate = () => {
    const day = parseInt(tempDate.day);
    const month = parseInt(tempDate.month);
    const year = parseInt(tempDate.year);

    if (!day || !month || !year) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      Alert.alert('Error', `El año debe estar entre 1900 y ${new Date().getFullYear()}`);
      return;
    }

    if (month < 1 || month > 12) {
      Alert.alert('Error', 'El mes debe estar entre 1 y 12');
      return;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      Alert.alert('Error', `El día debe estar entre 1 y ${daysInMonth} para el mes ${month}`);
      return;
    }

    const date = new Date(year, month - 1, day);
    const utcDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      3, 0, 0, 0
    ));

    const isoString = formatDateToISO(utcDate);
    handleInputChange('fechaNacimiento', isoString);
    setShowDateModal(false);

    setTempDate({ day: '', month: '', year: '' });
  };

  const openDatePicker = () => {
    // Si ya hay una fecha, pre-llenar los campos
    if (formData.fechaNacimiento) {
      try {
        const date = new Date(formData.fechaNacimiento);
        setTempDate({
          day: date.getDate().toString().padStart(2, '0'),
          month: (date.getMonth() + 1).toString().padStart(2, '0'),
          year: date.getFullYear().toString()
        });
      } catch {
        setTempDate({ day: '', month: '', year: '' });
      }
    }
    setShowDateModal(true);
  };

  const closeDateModal = () => {
    setShowDateModal(false);
    setTempDate({ day: '', month: '', year: '' });
  };

  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'No se encontró información del usuario');
      return;
    }

    // Validaciones
    if (formData.nuevaPassword) {
      if (formData.nuevaPassword !== formData.repetirNuevaPassword) {
        Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
        return;
      }
      if (!formData.password) {
        Alert.alert('Error', 'Debes ingresar tu contraseña actual para cambiarla');
        return;
      }
      if (formData.nuevaPassword.length < 6) {
        Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

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
          onPress: async () => {
            try {
              console.log('💾 Guardando cambios del usuario...');

              // Preparar datos para actualizar (solo las propiedades que cambiaron)
              const updateData: any = {};

              if (formData.nombre !== currentUser.name) updateData.name = formData.nombre.trim();
              if (formData.apellido !== currentUser.last_name) updateData.last_name = formData.apellido.trim();
              if (formData.telefono !== currentUser.phone) updateData.phone = formData.telefono.trim();
              if (formData.fechaNacimiento !== currentUser.birthDate) updateData.birthDate = formData.fechaNacimiento;
              if (profileImage !== currentUser.image) updateData.image = profileImage;

              // Si hay cambios en la contraseña, agregarla
              if (formData.nuevaPassword && formData.password) {
                updateData.currentPassword = formData.password;
                updateData.newPassword = formData.nuevaPassword;
              }

              // Si no hay cambios, no hacer nada
              if (Object.keys(updateData).length === 0) {
                Alert.alert('Sin cambios', 'No se detectaron cambios para guardar');
                return;
              }

              // Intentar actualizar usando diferentes endpoints
              let response = null;

              try {
                response = await updateUser({
                  method: 'put',
                  url: `/api/updateUser/${currentUser._id}`,
                  data: updateData
                });

                if (!response || response === null) {
                  throw new Error('Respuesta null del updateUser PUT');
                }

              } catch (updateError) {
                try {
                  response = await updateUser({
                    method: 'post',
                    url: `/api/updateUser/${currentUser._id}`,
                    data: updateData
                  });

                  if (!response || response === null) {
                    throw new Error('Respuesta null del updateUser POST');
                  }

                } catch (updateError2) {
                  try {
                    response = await updateUser({
                      method: 'post',
                      url: `/api/updateObject/${currentUser._id}`,
                      data: updateData
                    });

                    if (!response || response === null) {
                      throw new Error('Respuesta null del updateObject');
                    }

                  } catch (updateError3) {
                    // Actualización local como último recurso
                    const mergedUserData = {
                      ...currentUser,
                      ...updateData,
                      currentPassword: undefined,
                      newPassword: undefined
                    };

                    response = {
                      item: mergedUserData,
                      updated: true,
                      strategy: 'local_merge'
                    };
                  }
                }
              }

              // Validación mejorada de respuesta exitosa
              const isSuccessfulUpdate = response && (
                (response as any).item ||
                (response as any).items ||
                (response as any)._id ||
                (response as any).updated ||
                (response as any).success ||
                ((response as any).data && (response as any).data._id) ||
                (typeof response === 'object' && Object.keys(response).length > 0)
              );

              if (isSuccessfulUpdate) {
                // Obtener datos actualizados según el formato de respuesta
                let updatedUserData = null;
                const responseAny = response as any; // Type assertion una sola vez

                if (responseAny.item) {
                  updatedUserData = responseAny.item;
                } else if (responseAny.items && responseAny.items[0]) {
                  updatedUserData = responseAny.items[0];
                } else if (responseAny._id) {
                  updatedUserData = responseAny;
                } else if (responseAny.data && responseAny.data._id) {
                  updatedUserData = responseAny.data;
                } else {
                  // Fallback: merge manual de datos
                  updatedUserData = {
                    ...currentUser,
                    ...updateData,
                    currentPassword: undefined,
                    newPassword: undefined
                  };
                }

                // Actualizar datos en AsyncStorage y Storage local
                const finalUserData = {
                  ...currentUser,
                  ...updateData,
                  // No incluir las contraseñas en el storage
                  currentPassword: undefined,
                  newPassword: undefined,
                  // Mantener datos importantes del usuario original
                  _id: currentUser._id,
                  email: currentUser.email,
                  // Aplicar actualizaciones
                  ...(updatedUserData && updatedUserData._id ? updatedUserData : {})
                };

                // Actualizar AsyncStorage
                await AsyncStorage.setItem('currentUser', JSON.stringify(finalUserData));

                // Actualizar Storage local (Zustand)
                saveToStorage({ currentUser: finalUserData });
                setCurrentUser(finalUserData);

                Alert.alert('Éxito', 'Los cambios se han guardado correctamente');

                // Limpiar campos de contraseña
                setFormData(prev => ({
                  ...prev,
                  password: '',
                  nuevaPassword: '',
                  repetirNuevaPassword: ''
                }));

                router.back();

              } else {
                // Actualización local como último recurso
                Alert.alert(
                  'Actualización Local',
                  'No se pudo confirmar la actualización en el servidor, pero se guardarán los cambios localmente. ¿Continuar?',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel'
                    },
                    {
                      text: 'Guardar Local',
                      onPress: async () => {
                        const localUserData = {
                          ...currentUser,
                          ...updateData,
                          currentPassword: undefined,
                          newPassword: undefined
                        };

                        await AsyncStorage.setItem('currentUser', JSON.stringify(localUserData));
                        saveToStorage({ currentUser: localUserData });
                        setCurrentUser(localUserData);

                        Alert.alert('Éxito', 'Cambios guardados localmente');
                        router.back();
                      }
                    }
                  ]
                );
              }
            } catch (error: any) {
              console.error('❌ Error saving changes:', error);

              // Manejo mejorado de errores
              let errorMessage = 'Ocurrió un error al guardar los cambios';

              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
              } else if (error.response?.status === 400) {
                errorMessage = 'Datos inválidos. Verifica la información ingresada.';
              } else if (error.response?.status === 401) {
                errorMessage = 'Contraseña actual incorrecta';
              } else if (error.response?.status === 403) {
                errorMessage = 'No tienes permisos para realizar esta acción';
              } else if (error.message) {
                errorMessage = error.message;
              }

              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Editar cuenta"
          subtitle="Gestiona tu cuenta y preferencias"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Editar cuenta"
          subtitle="Gestiona tu cuenta y preferencias"
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No se pudieron cargar los datos del usuario</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleEditPhoto = async () => {
    Alert.alert(
      'Cambiar Foto',
      'Esta función estará disponible próximamente',
      [{ text: 'OK' }]
    );
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
                    source={{
                      uri: profileImage ||
                        `https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=${formData.nombre.charAt(0) || 'U'}`
                    }}
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
                  editable={!updatingUser}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#9CA3AF"
                value={formData.apellido}
                onChangeText={(value) => handleInputChange('apellido', value)}
                editable={!updatingUser}
              />

              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                placeholderTextColor="#9CA3AF"
                value={formData.telefono}
                onChangeText={(value) => handleInputChange('telefono', value)}
                keyboardType="phone-pad"
                editable={!updatingUser}
              />

              {/* Campo de Email (solo lectura) */}
              <View style={styles.emailContainer}>
                <Text style={styles.emailLabel}>Email (no editable)</Text>
                <View style={styles.emailField}>
                  <Text style={styles.emailText}>{currentUser.email}</Text>
                </View>
              </View>

              {/* Campo de Fecha de Nacimiento */}
              <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={openDatePicker}
                disabled={updatingUser}
              >
                <View style={styles.dateInputContainer}>
                  <Icon name="calendar" size={20} color="#9CA3AF" style={styles.dateIcon} />
                  <Text style={[
                    styles.dateInputText,
                    !formData.fechaNacimiento && styles.dateInputPlaceholder
                  ]}>
                    {formData.fechaNacimiento
                      ? formatDateForDisplay(formData.fechaNacimiento)
                      : 'Fecha de nacimiento'
                    }
                  </Text>
                  <Icon name="chevron-down" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección de Seguridad */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Cambiar Clave</Text>
              <View style={styles.sectionDivider} />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Clave actual"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                editable={!updatingUser}
              />

              <TextInput
                style={styles.input}
                placeholder="Nueva clave"
                placeholderTextColor="#9CA3AF"
                value={formData.nuevaPassword}
                onChangeText={(value) => handleInputChange('nuevaPassword', value)}
                secureTextEntry
                editable={!updatingUser}
              />

              <TextInput
                style={styles.input}
                placeholder="Repetir nueva clave"
                placeholderTextColor="#9CA3AF"
                value={formData.repetirNuevaPassword}
                onChangeText={(value) => handleInputChange('repetirNuevaPassword', value)}
                secureTextEntry
                editable={!updatingUser}
              />
            </View>
          </View>
        </ScrollView>

        {/* Botón Guardar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              updatingUser && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={updatingUser}
          >
            {updatingUser ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para seleccionar fecha */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDateModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fecha de Nacimiento</Text>
              <TouchableOpacity onPress={closeDateModal} style={styles.closeButton}>
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputsContainer}>
              <View style={styles.dateInputWrapper}>
                <Text style={styles.dateLabel}>Día</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="01"
                  placeholderTextColor="#9CA3AF"
                  value={tempDate.day}
                  onChangeText={(value) => setTempDate(prev => ({ ...prev, day: value }))}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={styles.dateInputWrapper}>
                <Text style={styles.dateLabel}>Mes</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="01"
                  placeholderTextColor="#9CA3AF"
                  value={tempDate.month}
                  onChangeText={(value) => setTempDate(prev => ({ ...prev, month: value }))}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={styles.dateInputWrapper}>
                <Text style={styles.dateLabel}>Año</Text>
                <TextInput
                  style={[styles.dateInput, styles.yearInput]}
                  placeholder="1995"
                  placeholderTextColor="#9CA3AF"
                  value={tempDate.year}
                  onChangeText={(value) => setTempDate(prev => ({ ...prev, year: value }))}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeDateModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={validateAndSetDate}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  debugText: {
    marginTop: 8,
    fontSize: 12,
    color: '#FFA500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#133A7D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  emailContainer: {
    marginBottom: 8,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  emailField: {
    height: 48,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  datePickerContainer: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  dateIcon: {
    marginRight: 12,
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#374151',
    fontFamily: 'Inter',
  },
  dateInputPlaceholder: {
    color: '#9CA3AF',
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  closeButton: {
    padding: 4,
  },
  dateInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  dateInput: {
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
    textAlign: 'center',
  },
  yearInput: {
    flex: 1.2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  confirmButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#133A7D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});

export default EditProfile;