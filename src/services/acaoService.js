import axios from 'axios';
import api from '../api/api';

export const acaoService = {
    buscarTodas: () => api.get('/Acoes/Listar'),
    buscarPorId: (id) => api.get(`/Acoes/BuscarId?Id=${id}`),
    buscarPorNome: (nome) => api.get(`/Acoes/BuscarNome?nome=${nome}`),
    cadastrar: (acao) => api.post('/Acoes/Cadastrar', acao),
    atualizar: (acao) => api.put('/Acoes/Atualizar', acao),
    deletar: (id) => api.delete(`/Acoes/Deletar?Id=${id}`),
};