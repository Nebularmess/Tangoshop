import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("currentUser");
        console.log("userData", userData);
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