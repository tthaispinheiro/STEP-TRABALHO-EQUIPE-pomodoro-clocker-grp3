// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5002', // URL base da API
});

export default api;
