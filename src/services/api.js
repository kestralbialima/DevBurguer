import axios from 'axios';

// 🚀 Criamos a conexão base com o seu servidor Node
export const api = axios.create({
  baseURL: 'http://localhost:3001',
});

/* 🔒 INTERCEPTOR DE SEGURANÇA:
  Ele roda ANTES de cada requisição. Ele vai no "bolso" do navegador (LocalStorage),
  pega o Token do usuário e coloca no cabeçalho (Header) da chamada.
*/
api.interceptors.request.use(async (config) => {
  const userData = await localStorage.getItem('devburger:userData');
  const token = userData && JSON.parse(userData).token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});