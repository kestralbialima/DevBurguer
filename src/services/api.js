import axios from 'axios';

/**
 * 🚀 CONFIGURAÇÃO DA BASE URL:
 * Se estivermos em produção (no Render), usamos a URL da API live.
 * Caso contrário, usamos o localhost para testes.
 */
const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://devburger-backend-a4zs.onrender.com' 
    : 'http://localhost:3001',
});

/* 🔒 INTERCEPTOR DE SEGURANÇA:
   Ele garante que o Token de autenticação acompanhe todas as chamadas,
   permitindo que o usuário acesse áreas protegidas e faça pedidos.
*/
api.interceptors.request.use(async (config) => {
  const userData = localStorage.getItem('devburger:userData');
  
  if (userData) {
    const token = JSON.parse(userData).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

export default api;