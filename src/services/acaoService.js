import axios from 'axios';

const API_URL = "https://localhost:7xxx/api/Acoes"; // Ajuste sua porta aqui

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const acaoService = {
    buscarTodas: () => axios.get(API_URL, getAuthHeader()),
    buscarPorNome: (nome) => axios.get(`${API_URL}/buscar/${nome}`, getAuthHeader()),
    cadastrar: (acao) => axios.post(API_URL, acao, getAuthHeader()),
    atualizar: (id, acao) => axios.put(`${API_URL}/${id}`, acao, getAuthHeader()),
    deletar: (id) => axios.delete(`${API_URL}/${id}`, getAuthHeader()),
};