import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7238', 
});

export default api;