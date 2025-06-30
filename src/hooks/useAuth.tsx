import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import useStore from "./useStorage";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const { save  } = useStore();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("currentUser");
        if(userData) {
          save({currentUser: JSON.parse(userData)})
        }
        setIsAuthenticated(!!userData); // true si hay usuario, false si no
      } catch (error) {
        console.error("Error checking auth", error);
        setIsAuthenticated(false);
      }
    };
    checkUser();
  }, []);

  return { isAuthenticated };
}