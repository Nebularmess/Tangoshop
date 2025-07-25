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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Feedback"
          subtitle="Comparte tu opinión con nosotros"
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
        </Header>

        <View style={styles.contentContainer}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Escribe tus recomendaciones aquí..."
                placeholderTextColor="#8E8E93"
                value={recomendaciones}
                onChangeText={setRecomendaciones}
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.bottomSection}>
              <Text style={styles.helpText}>
                Tus comentarios nos ayudan a mejorar
              </Text>
              
              <TouchableOpacity style={styles.enviarButton} onPress={handleEnviar}>
                <Text style={styles.enviarButtonText}>Enviar Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  inputContainer: {
    flex: 1,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    textAlignVertical: 'top',
  },
  bottomSection: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
  },
  enviarButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 140,
  },
  enviarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Feedback;