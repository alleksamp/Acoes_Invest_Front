import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Dashboard.css'; 

export function Dashboard() {
    const [acoes, setAcoes] = useState([]); // Estado para guardar a lista
    const [nomeBusca, setNomeBusca] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

    const buscarAcoes = async () => {
        alert("Botão clicado!"); 
        console.log("Iniciando busca...");
    setCarregando(true);
    try {
      const token = localStorage.getItem('token');
      
      // Enviando o token no header Authorization
      const response = await api.get('/api/Acoes/Listar Ações', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAcoes(response.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar ações.');
    } finally {
      setCarregando(false);
    }
  };

    const buscarPorNome = async () => {
    if (!nomeBusca.trim()) {
    alert("Digite um nome para buscar.");
    return;
    } 

  setCarregando(true);
    try {
    const token = localStorage.getItem('token');
    
    // O Axios enviará como Query String: /api/Acoes/Buscar por nome?nome=Itausa
    const response = await api.get('/api/Acoes/Buscar por nome', {
      params: { nome: nomeBusca }, // O Axios monta o ?nome=... para você
      headers: { Authorization: `Bearer ${token}` }
    });

    setAcoes(response.data); // Atualiza a tabela com o resultado da busca
  } catch (err) {
    console.error(err);
    alert('Ação não encontrada ou erro na busca.');
  } finally {
    setCarregando(false);
  }
};


return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        <header className="dashboard-header">
          <h1>📊 Gerenciador de Ações</h1>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </header>

        <div className="grid-options">
          <section className="card">
            <h2>Consultas</h2>
            <button className="btn-option" onClick={buscarAcoes}>
              {carregando ? 'Buscando...' : '🔍 Buscar Todas as Ações'}
            </button>
            <h2>Buscar por nome:</h2>
        <div className="search-group">
            <input 
                type="text" 
                placeholder="Digite o nome da ação..." 
                className="form-input"
                value={nomeBusca}
                onChange={(e) => setNomeBusca(e.target.value)}
            />
            <button className="btn-search" onClick={buscarPorNome}>
                🔎 Buscar
            </button>
        </div>
          </section>

          <section className="card">
            <h2 style={{color: '#047857'}}>Operações</h2>
            <button className="btn-option" style={{color: '#047857', fontWeight: 'bold'}}>
                ➕ Cadastrar Nova Ação
            </button>
          </section>
        </div>

        {/* TABELA DE RESULTADOS */}
        {acoes.length > 0 && (
          <div className="acoes-table-container">
            <h3>Lista de Ações Cadastradas</h3>
            <table className="acoes-table">
              <thead>
                <tr>
                  <th>Código/Nome</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {acoes.map((acao) => (
                  <tr key={acao.id}>
                    <td>{acao.nome}</td>
                    <td>R${acao.preco}</td>
                    <td>{acao.quantidade}</td>
                    <td>
                      <button style={{color: 'blue', marginRight: '10px'}}>Editar</button>
                      <button style={{color: 'red'}}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}