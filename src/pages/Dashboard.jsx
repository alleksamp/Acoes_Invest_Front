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
        console.log("Iniciando busca...");
    setCarregando(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.get('/api/Acoes/Listar', {
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
    const response = await api.get('/api/Acoes/BuscarNome', {
      params: { nome: nomeBusca }, // O Axios monta o ?nome=... para você
      headers: { Authorization: `Bearer ${token}` }
    });

    setAcoes(response.data); 
  } catch (err) {
    console.error(err);
    alert('Ação não encontrada ou erro na busca.');
  } finally {
    setCarregando(false);
  }
};

const deletarAcao = async (id) => {
  if (!window.confirm("Tem certeza que deseja excluir esta ação?")) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    
    await api.delete('/api/Acoes/Deletar', {
      params: { id: id },
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Ação excluída com sucesso!");
    
    buscarAcoes(); 
    
  } catch (err) {
    console.error("Erro ao excluir:", err);
    alert("Não foi possível excluir a ação.");
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
            <button className="btn-option" onClick={() => navigate('/cadastrar')} style={{color: '#047857', fontWeight: 'bold'}}>
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
                  <th>Nome/Código</th>
                  <th>Quantidade</th>
                  <th>Preço Médio</th>
                  <th>Preço Médio IR</th>
                  <th>Dividendos</th>
                  <th>Total Investido</th>
                </tr>
              </thead>
              <tbody>
                {acoes.map((acao) => (
                  <tr key={acao.Id || acao.id}>
                    <td>{acao.nome}</td>
                    <td>{acao.quantidade}</td>
                    <td>R${acao.pm}</td>
                    <td>R${acao.pmIr}</td>
                    <td>R${acao.dividendos}</td>
                    <td>R${acao.totalInv}</td>
                    <td>
                      <button 
                        className="btn-editar" 
                        onClick={() => navigate(`/editar/${acao.Id || acao.id}`)}> Editar
                      </button>
                      <button 
                        className="btn-excluir" 
                        onClick={() => deletarAcao(acao.Id || acao.id )}> Excluir
                      </button>
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