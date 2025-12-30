import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Create axios instance
export const client = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors
setupInterceptors(client);
