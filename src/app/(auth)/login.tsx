import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login pressed', { email, password });
    // Aquí manejarías la lógica de login
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <StatusBar barStyle="light-content" />
      
      {/* Fondo azul con gradiente simulado */}
      <View className="flex-1 bg-blue-600 relative">
        {/* Elementos decorativos para simular profundidad */}
        <View className="absolute top-20 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-30" />
        <View className="absolute top-40 left-8 w-24 h-24 bg-blue-300 rounded-full opacity-20" />
        <View className="absolute bottom-32 right-16 w-28 h-28 bg-blue-500 rounded-full opacity-25" />
        <View className="absolute bottom-64 left-12 w-20 h-20 bg-blue-400 rounded-full opacity-15" />
        
        <View className="flex-1 justify-center px-8">
          {/* Título */}
          <View className="mb-12 items-center">
            <Text className="text-white text-4xl font-bold mb-2">Bienvenido</Text>
            <Text className="text-blue-100 text-lg">Inicia sesión en tu cuenta</Text>
          </View>

          {/* Formulario con efecto glassmorphism */}
          <View className="rounded-3xl p-8 border border-white border-opacity-30">
            {/* Campo Email */}
            <View className="mb-6">
              <Text className="text-white text-sm font-medium mb-2 ml-1">Email</Text>
              <View className="bg-white bg-opacity-80 rounded-2xl border border-white border-opacity-30">
                <TextInput
                  className="px-4 py-4 text-base"
                  placeholder="Ingresa tu email"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Campo Password */}
            <View className="mb-8">
              <Text className="text-white text-sm font-medium mb-2 ml-1">Contraseña</Text>
              <View className="bg-white bg-opacity-20 rounded-2xl border border-white border-opacity-30">
                <TextInput
                  className="px-4 py-4 text-base"
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="rgb(199, 199, 199)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Botón de Login */}
            <TouchableOpacity
              onPress={handleLogin}
              className="rounded-2xl py-4 mb-4 border border-white border-opacity-40"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Iniciar Sesión
              </Text>
            </TouchableOpacity>

            {/* Link olvidé contraseña */}
            <TouchableOpacity className="items-center">
              <Text className="text-blue-100 text-sm">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <View className="flex-row">
              <Text className="text-blue-100 text-sm">¿No tienes cuenta? </Text>
              <TouchableOpacity>
                <Text className="text-white text-sm font-semibold underline">
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}