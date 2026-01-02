import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import '../CadastrarAcao/CadastrarAcao.css'; 

export function EditarAcao() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);

  // Estados dos campos
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pm, setPm] = useState('');
  const [pmIr, setPmIr] = useState('');
  const [dividendos, setDividendos] = useState('');
  const [totalInv, setTotalInv] = useState('');

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/Acoes/BuscarId', {
          params: { id: id },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const acao = response.data;
        setNome(acao.nome || acao.Nome);
        setQuantidade(acao.quantidade || acao.Quantidade);
        setPm(acao.pm || acao.Pm);
        setPmIr(acao.pmIr || acao.PmIr);
        setDividendos(acao.dividendos || acao.Dividendos);
        setTotalInv(acao.totalInv || acao.TotalInv);
      } catch (err) {
        alert("Erro ao carregar dados da ação.");
        navigate('/dashboard');
      }
    };
    buscarDados();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const token = localStorage.getItem('token');
      const dadosAtualizados = {
        Id: parseInt(id),
        Nome: nome,
        Quantidade: parseInt(quantidade),
        Pm: parseFloat(pm),
        PmIr: parseFloat(pmIr),
        Dividendos: parseFloat(dividendos),
        TotalInv: parseFloat(totalInv)
      };

      // Verifique no seu Swagger o nome exato da rota de Update (PUT)
      await api.put('/api/Acoes/Atualizar', dadosAtualizados, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Ação atualizada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar ação.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2>🔄 Editar Ação</h2>
        <form onSubmit={handleUpdate} className="cadastro-grid-form">
          <div className="form-group full-width">
            <label>Nome</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value.toUpperCase)} required />
            <label>Quantidade</label>
            <input type="text" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
            <label>Preço Médio</label>
            <input type="text" value={pm} onChange={e => setPm(e.target.value)} required />
            <label>Preço Médio IR</label>
            <input type="text" value={pmIr} onChange={e => setPmIr(e.target.value)} required />
            <label>Dividendos</label>
            <input type="text" value={dividendos} onChange={e => setDividendos(e.target.value)} required />
            <label>Total Investido</label>
            <input type="text" value={totalInv} onChange={e => setTotalInv(e.target.value)} required />
          </div>
          {/* ... adicione os outros campos (quantidade, pm, etc) aqui ... */}
          
          <div className="button-group full-width">
            <button type="submit" className="btn-salvar" disabled={carregando}>
              {carregando ? 'Salvando...' : 'Atualizar Dados'}
            </button>
            <button type="button" className="btn-cancelar" onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}