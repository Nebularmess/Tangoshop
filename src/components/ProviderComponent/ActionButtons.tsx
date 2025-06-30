import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ActionButtonsProps {
  phone?: string;
  email?: string;
  website?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  phone,
  email,
  website
}) => {
  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Teléfono no disponible', 'Este proveedor no tiene teléfono registrado.');
    }
  };

  const handleMessage = () => {
    if (phone) {
      Linking.openURL(`https://wa.me/${phone.replace(/[^\d]/g, '')}`);
    } else {
      Alert.alert('WhatsApp no disponible', 'Este proveedor no tiene WhatsApp registrado.');
    }
  };

  const handleEmail = () => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      Alert.alert('Email no disponible', 'Este proveedor no tiene email registrado.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={handleCall}
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="phone" size={20} color="white" />
          <Text style={styles.buttonText}>Llamar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleMessage}
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="message-text" size={20} color="white" />
          <Text style={styles.buttonText}>Mensaje</Text>
        </TouchableOpacity>
      </View>

      {email && (
        <TouchableOpacity
          onPress={handleEmail}
          style={styles.emailButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="email-outline" size={18} color="#374151" />
          <Text style={styles.emailButtonText}>Enviar Email</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emailButton: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButtonText: {
    color: '#374151',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ActionButtons;