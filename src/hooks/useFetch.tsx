import { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// Definís una interfaz opcional para tipar más fuerte si querés:
interface Config extends AxiosRequestConfig {} // ya incluye method, url, params, data, etc.

const useAxios = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = async (config: Config): Promise<T | void> => {
    setLoading(true);
    try {
      const response = await axios<T>(config);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err as AxiosError);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};

export default useAxios;