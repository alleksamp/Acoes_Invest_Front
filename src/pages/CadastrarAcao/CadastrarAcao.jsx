import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './CadastrarAcao.css';

export function CadastrarAcao() {

  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pm, setPm] = useState('');
  const [pmIr, setPmIr] = useState('');
  const [dividendos, setDividendos] = useState('');
  const [totalInv, setTotalInv] = useState('');
  
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const token = localStorage.getItem('token');
      
      const novaAcao = {
        nome: nome,
        quantidade: parseInt(quantidade),
        pm: parseFloat(pm),
        pmIr: parseFloat(pmIr),
        dividendos: parseFloat(dividendos),
        totalInv: parseFloat(totalInv)
      };

      await api.post('/api/Acoes/Cadastrar', novaAcao, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Ação cadastrada com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar: verifique se os campos estão corretos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2>➕ Nova Ação</h2>
        <form onSubmit={handleCadastro} className="cadastro-grid-form">
          
          <div className="form-group full-width">
            <label>Nome da Ação</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: Itausa ITSA4" />
          </div>

          <div className="form-group">
            <label>Quantidade</label>
            <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Preço Médio (Pm)</label>
            <input type="number" step="0.01" value={pm} onChange={(e) => setPm(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Pm IR</label>
            <input type="number" step="0.01" value={pmIr} onChange={(e) => setPmIr(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Dividendos</label>
            <input type="number" step="0.01" value={dividendos} onChange={(e) => setDividendos(e.target.value)} required />
          </div>

          <div className="form-group full-width">
            <label>Total Investido (TotalInv)</label>
            <input type="number" step="0.01" value={totalInv} onChange={(e) => setTotalInv(e.target.value)} required />
          </div>
          
          <div className="button-group full-width">
            <button type="submit" className="btn-salvar" disabled={carregando}>
              {carregando ? 'Enviando...' : 'Confirmar Cadastro'}
            </button>
            <button type="button" className="btn-cancelar" onClick={() => navigate('/dashboard')}>
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}