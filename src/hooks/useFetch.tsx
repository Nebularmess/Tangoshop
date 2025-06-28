import { useState } from 'react';
import axios from '../utils/axios';

const URL_BASE = 'https://realnodegraphapi-production.up.railway.app';

interface config {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  data?: object[] | object;
  params?: Record<string, any>;
  headers?: Record<string, any>;
}

const useAxios = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const execute = async (config: config): Promise<T | void> => {
    setLoading(true);
    try {
      config.url = `${URL_BASE}${config.url}`;
      const response = await axios<T>(config);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};

export default useAxios;