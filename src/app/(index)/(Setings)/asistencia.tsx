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
    router.push('/ayuda');
  };

  const handleFAQ = () => {
    router.push('/faq');
  };

  const handleFeedback = () => {
    router.push('/feedback');
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
      description: '+54-3624-420686\ncontacto@contacto.com\nFrench 400 / Piso 2 - Oficina 5A',
      icon: 'phone',
      onPress: handleContactUs,
    },
  ];

  const AssistanceItem = ({ option }: { option: AssistanceOption }) => (
    <TouchableOpacity style={styles.assistanceItem} onPress={option.onPress}>
      <View style={styles.iconContainer}>
        <Icon name={option.icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Asistencia"
          subtitle="¿En qué podemos ayudarte?"
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
          {assistanceOptions.map((option) => (
            <AssistanceItem key={option.id} option={option} />
          ))}
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
  assistanceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});

export default Asistencia;