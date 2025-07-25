import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/header';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleBack = () => {
    router.back();
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: '¿Cómo agregar un producto a mi catálogo personalizado?',
      answer: 'Para agregar un producto nuevo a tu catálogo personalizado, es tan sencillo como agregar el producto a tus favoritos; una vez enlazado, el producto se traspasará a tu catálogo en la web'
    },
    {
      id: '2',
      question: '¿Cómo contactar a un proveedor?',
      answer: 'Tienes varias opciones disponibles, ingresando al perfil del proveedor se te brindarán sus datos de contacto, así como también botones directos para llamarlos o enviarles un mensaje'
    },
    {
      id: '3',
      question: '¿Cómo obtengo mi catálogo personalizado?',
      answer: 'Tu catálogo personalizado está disponible en "Ajustes", allí encontrarás una opción denominada "Mi Catálogo" en la que se te redirigirá a una web en la que podrás compartir con tus clientes, difundir en redes sociales o cargar en tu portafolio de productos'
    },
    {
      id: '4',
      question: '¿Cómo buscar productos específicos?',
      answer: 'Puedes utilizar la función de búsqueda en la pantalla principal o navegar por categorías para encontrar productos específicos que te interesen'
    },
    {
      id: '5',
      question: '¿Cómo gestionar mis favoritos?',
      answer: 'En la sección de favoritos puedes ver todos los productos que has marcado como favoritos y gestionarlos fácilmente'
    }
  ];

  const FAQItemComponent = ({ item }: { item: FAQItem }) => {
    const isExpanded = expandedItems.includes(item.id);

    return (
      <View style={styles.faqItem}>
        <TouchableOpacity 
          style={styles.faqHeader} 
          onPress={() => toggleExpanded(item.id)}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <Icon 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#8E8E93" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Preguntas Frecuentes"
          subtitle="Encuentra respuestas a tus dudas"
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
          <View style={styles.faqContainer}>
            {faqData.map((item) => (
              <FAQItemComponent key={item.id} item={item} />
            ))}
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
  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 12,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  answerText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});

export default FAQ;