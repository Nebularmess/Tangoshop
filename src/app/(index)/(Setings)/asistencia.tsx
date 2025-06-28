import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/header';

interface AssistanceOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

const Asistencia = () => {
  const handleBack = () => {
    router.back();
  };

  const handleNeedHelp = () => {
    Alert.alert(
      '¿Necesitas ayuda?',
      'Describe tu problema o pregunta para que podamos ayudarte de la mejor manera.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar mensaje',
          onPress: () => {
            console.log('Abriendo formulario de ayuda...');
          },
        },
      ]
    );
  };

  const handleFAQ = () => {
    Alert.alert(
      'Preguntas Frecuentes',
      'Te redirigiremos a nuestra sección de preguntas frecuentes.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Ver FAQ',
          onPress: () => {
            console.log('Navegando a FAQ...');
          },
        },
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Feedback',
      'Tu opinión es muy importante para nosotros.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Dar feedback',
          onPress: () => {
            console.log('Abriendo formulario de feedback...');
          },
        },
      ]
    );
  };

  const handleContactUs = () => {
    Alert.alert(
      'Contactanos',
      'Elige cómo prefieres contactarnos:',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Llamar',
          onPress: () => {
            Linking.openURL('tel:+5436244200686');
          },
        },
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL('mailto:contacto@contacto.com');
          },
        },
      ]
    );
  };

  const handleOtherOption = () => {
    Alert.alert(
      'Otra opción',
      'Para consultas específicas, nuestro equipo está disponible para ayudarte.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Contactar',
          onPress: () => {
            console.log('Contactando para otra opción...');
          },
        },
      ]
    );
  };

  const assistanceOptions: AssistanceOption[] = [
    {
      id: 'needHelp',
      title: '¿Necesitas ayuda?',
      description: 'Describe tu problema o pregunta para que podamos ayudarte',
      icon: 'help-circle',
      onPress: handleNeedHelp,
    },
    {
      id: 'faq',
      title: 'Preguntas Frecuentes (FAQ)',
      description: 'Encuentra la respuesta a preguntas comunes que hayan tenido otros socios',
      icon: 'message-circle',
      onPress: handleFAQ,
    },
    {
      id: 'feedback',
      title: 'Feedback',
      description: 'Brindanos tu opinión sobre el servicio que provemos para mejorar aún más',
      icon: 'thumbs-up',
      onPress: handleFeedback,
    },
    {
      id: 'contact',
      title: 'Contactanos',
      description: 'Nro tel: +54-3624-420686\nContacto@contacto.com\nCalle French 400 piso 2\nOficina 5a',
      icon: 'phone',
      onPress: handleContactUs,
    },
    {
      id: 'other',
      title: 'Otra opción',
      description: 'Brindanos tu opinión sobre el servicio que provemos para mejorar aún más',
      icon: 'more-horizontal',
      onPress: handleOtherOption,
    },
  ];

  const AssistanceItem = ({ option }: { option: AssistanceOption }) => (
    <View style={styles.assistanceItemWrapper}>
      <TouchableOpacity style={styles.assistanceItem} onPress={option.onPress}>
        <View style={styles.itemContent}>
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <Icon name={option.icon} size={20} color="#374151" />
            </View>
          </View>
          <View style={styles.textSection}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Asistencia"
        subtitle="¿En qué podemos ayudarte?"
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
          {assistanceOptions.map((option) => (
            <AssistanceItem key={option.id} option={option} />
          ))}
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
    paddingBottom: 40,
  },
  assistanceItemWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  assistanceItem: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 0,
  },
  iconSection: {
    backgroundColor: '#FFFFFF',
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textSection: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: 'Inter',
  },
  optionDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#94A3B8',
    lineHeight: 18,
    fontFamily: 'Inter',
  },
});

export default Asistencia;