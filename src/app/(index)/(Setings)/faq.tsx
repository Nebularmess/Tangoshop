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
            color="#374151" 
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
    <SafeAreaView style={styles.container}>
      <Header
        title="Preguntas Frecuentes"
        subtitle=""
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
  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    marginRight: 12,
    fontFamily: 'Inter',
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  answerText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
});

export default FAQ;