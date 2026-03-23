import axios from 'axios';
import { getToken } from '../utility/common';

const instance = axios.create({
  baseURL: 'https://poll-app-deployment-latest.onrender.com',
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;