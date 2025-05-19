import { Ionicons } from '@expo/vector-icons'; // Asumiendo que estás usando Expo
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#7B8794" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#7B8794"
        onChangeText={onChangeText}
        value={value}
      />
      <Ionicons name="options" size={20} color="#7B8794" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  icon: {
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#1A1A1A',
    padding: 8,
  },
});

export default SearchBar;