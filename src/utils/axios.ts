import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: 'https://realnodegraphapi-production.up.railway.app',
});

// Interceptor para agregar el token
api.interceptors.request.use(async (config) => {
  const user = await AsyncStorage.getItem("currentUser");
  const parsed = user ? JSON.parse(user) : null;
  const token = parsed?.token;

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export default api;
