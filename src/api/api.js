import axios from 'axios';

const api = axios.create({
  // A URL que você me passou do Swagger
  baseURL: 'https://localhost:7238', 
});

export default api;