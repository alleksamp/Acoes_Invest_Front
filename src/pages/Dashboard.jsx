import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Dashboard.css';
import Swal from 'sweetalert2';

export function Dashboard() {
    const [acoes, setAcoes] = useState([]);
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

          Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível listar as ações.',
            icon: 'error',
            confirmButtonColor: '#d33'
        });
      } finally {
          setCarregando(false);
      }

    };

    const buscarPorNome = async () => {
    if (!nomeBusca.trim()) {
          Swal.fire({
            title: 'Campo Vazio',
            text: 'Por favor, digite um nome para buscar.',
            icon: 'warning',
            confirmButtonColor: '#3085d6'
        });
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
          Swal.fire({
            title: 'Não encontrado',
            text: 'Nenhuma ação foi encontrada com esse nome.',
            icon: 'error',
            confirmButtonColor: '#3085d6'
        });

  } finally {
    setCarregando(false);
  }
};

const deletarAcao = async (id) => {
      Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', // Vermelho para deletar
        cancelButtonColor: '#3085d6', // Azul para cancelar
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
  try {
    const token = localStorage.getItem('token');
    
    await api.delete('/api/Acoes/Deletar', {
      params: { id: id },
      headers: { Authorization: `Bearer ${token}` }
    });

        Swal.fire(
          'Excluído!',
          'A ação foi deletada com sucesso.',
          'success'
        );
    
    buscarAcoes(); 
    
  } catch (err) {
    console.error("Erro ao excluir:", err);

      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível excluir a ação.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  }
  });
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