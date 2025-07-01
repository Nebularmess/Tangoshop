// src/hooks/useAuth.tsx - Versión mejorada
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import useStore from "./useStorage";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { save, clear, getCurrentUser } = useStore();
  const router = useRouter();

  const checkUser = useCallback(async () => {
    try {
      console.log('🔍 Verificando autenticación...');
      
      // Primero verificar si hay usuario en Zustand
      const currentUser = getCurrentUser();
      if (currentUser?._id) {
        console.log('✅ Usuario encontrado en Zustand:', currentUser.email);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Si no hay en Zustand, verificar AsyncStorage
      const userData = await AsyncStorage.getItem("currentUser");
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          if (parsedUser?._id) {
            console.log('✅ Usuario encontrado en AsyncStorage:', parsedUser.email);
            
            // Restaurar en Zustand
            save({ currentUser: parsedUser });
            setIsAuthenticated(true);
          } else {
            console.log('❌ Datos de usuario inválidos en AsyncStorage');
            await AsyncStorage.removeItem("currentUser");
            clear();
            setIsAuthenticated(false);
          }
        } catch (parseError) {
          console.error('❌ Error parsing user data:', parseError);
          await AsyncStorage.removeItem("currentUser");
          clear();
          setIsAuthenticated(false);
        }
      } else {
        console.log('❌ No hay usuario almacenado');
        clear();
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("❌ Error checking auth:", error);
      // En caso de error, limpiar todo
      try {
        await AsyncStorage.removeItem("currentUser");
        clear();
      } catch (cleanupError) {
        console.error("Error durante cleanup:", cleanupError);
      }
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [save, clear, getCurrentUser]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const logout = useCallback(async (redirectTo: string = '/(auth)/termsAgree') => {
    try {
      console.log('🚪 Ejecutando logout desde useAuth...');
      
      // 1. Actualizar estado inmediatamente
      setIsAuthenticated(false);
      setIsLoading(true);
      
      // 2. Limpiar stores
      clear();
      
      // 3. Limpiar AsyncStorage
      await AsyncStorage.clear();
      
      console.log('✅ Logout completado');
      
      // 4. Navegar con delay para evitar problemas de timing
      setTimeout(() => {
        try {
          if (router && typeof router.replace === 'function') {
            router.replace(redirectTo as any);
          } else {
            console.warn('Router replace no disponible, usando push');
            router.push(redirectTo as any);
          }
        } catch (navError) {
          console.error('Error en navegación:', navError);
        } finally {
          setIsLoading(false);
        }
      }, 150);
      
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      
      // Forzar estado no autenticado incluso si hay error
      setIsAuthenticated(false);
      setIsLoading(false);
      
      // Intentar navegar de todas formas
      setTimeout(() => {
        try {
          router.replace(redirectTo as any);
        } catch (navError) {
          console.error('Error en navegación de fallback:', navError);
        }
      }, 200);
    }
  }, [clear, router]);

  const refreshAuth = useCallback(() => {
    setIsLoading(true);
    checkUser();
  }, [checkUser]);

  return { 
    isAuthenticated, 
    isLoading,
    logout,
    refreshAuth
  };
}