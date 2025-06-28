import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/header';

const Feedback = () => {
  const [recomendaciones, setRecomendaciones] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleEnviar = () => {
    if (recomendaciones.trim() === '') {
      Alert.alert('Error', 'Por favor escribe tus recomendaciones antes de enviar.');
      return;
    }

    Alert.alert(
      'Feedback Enviado',
      '¡Gracias por tu feedback! Tus comentarios nos ayudan a mejorar nuestro servicio.',
      [
        {
          text: 'OK',
          onPress: () => {
            setRecomendaciones('');
            console.log('Feedback enviado:', recomendaciones);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Feedback"
        subtitle=""
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonCircle}>
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Header>

      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tus recomendaciones"
              placeholderTextColor="#9CA3AF"
              value={recomendaciones}
              onChangeText={setRecomendaciones}
              multiline={true}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.helpText}>
              Tus comentarios nos ayudan a mejorar!
            </Text>
            
            <TouchableOpacity style={styles.enviarButton} onPress={handleEnviar}>
              <Text style={styles.enviarButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
  inputContainer: {
    flex: 1,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#374151',
    textAlignVertical: 'top',
  },
  bottomSection: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  enviarButton: {
    backgroundColor: '#133A7D',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  enviarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});

export default Feedback;