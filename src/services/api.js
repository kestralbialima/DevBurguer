import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://devburger-backend-a4zs.onrender.com' 
    : 'http://localhost:3001',
});

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

// 🚀 O SEGREDO: Exportamos das duas formas para não dar erro em nenhum lugar
export { api }; // Exportação nomeada (resolve o erro da Home)
export default api; // Exportação padrão