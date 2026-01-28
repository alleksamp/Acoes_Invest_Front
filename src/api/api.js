import axios from 'axios';


const api = axios.create({
  baseURL: 'https://localhost:7238/api', 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@AcoesInvest:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
  (error) => {
    // Trata erros que ocorrem antes da requisição ser enviada
    return Promise.reject(error);
});

export default api;