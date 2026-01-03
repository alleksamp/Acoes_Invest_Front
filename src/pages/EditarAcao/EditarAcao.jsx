import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import '../CadastrarAcao/CadastrarAcao.css'; 

    const formatarMoeda = (valor) => {
        if (valor === undefined || valor === null || valor === "") return "R$ 0,00";
        let limpo = String(valor).replace(/\D/g, "");
        let decimal = (Number(limpo) / 100).toFixed(2);
    
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(decimal);
    };

    const converterParaDecimal = (valor) => {
        if (!valor) return 0;
        if (typeof valor === 'number') return valor;
        return parseFloat(String(valor).replace("R$", "").replace(/\./g, "").replace(",", "."));
      };

export function EditarAcao() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);

  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pm, setPm] = useState('');
  const [pmIr, setPmIr] = useState('');
  const [dividendos, setDividendos] = useState('');
  const [totalInv, setTotalInv] = useState('');

  useEffect(() => {
    const buscarDados = async () => {
        if (!id || id === "${id}") return;

      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/Acoes/BuscarId?id=${id}`, {
          //params: { Id: id },
          headers: { Authorization: `Bearer ${token}` }
        });

        const acao = response.data;
        console.log("Dados carregados:", acao);

        setNome(acao.nome || acao.Nome || "");
        setQuantidade(acao.quantidade || acao.Quantidade || 0);
        setPm(formatarMoeda((acao.pm || acao.Pm || 0) * 100));
        setPmIr(formatarMoeda((acao.pmIr || acao.PmIr || 0) * 100));
        setDividendos(formatarMoeda((acao.dividendos || acao.Dividendos || 0) * 100));
        setTotalInv(formatarMoeda((acao.totalInv || acao.TotalInv || 0) * 100));
      } catch (err) {
        console.error("Erro na busca:", err);
        alert("Erro ao carregar dados da ação.");
        navigate('/dashboard');
      }
    };
    buscarDados();
  }, [id, navigate]);

    useEffect(() => {
            const qtd = parseInt(quantidade) || 0;
            const preco = converterParaDecimal(pm);
            const total = qtd * preco;
            
            setTotalInv(formatarMoeda((total * 100).toFixed(0)));
        }, [quantidade, pm]);



  const handleUpdate = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const token = localStorage.getItem('token');
      const dadosAtualizados = {
        Id: parseInt(id),
        Nome: nome,
        Quantidade: parseInt(quantidade),
        Pm: converterParaDecimal(pm),
        PmIr: converterParaDecimal(pmIr),
        Dividendos: converterParaDecimal(dividendos),
        TotalInv: converterParaDecimal(totalInv)
      };

      await api.put('/api/Acoes/Atualizar', dadosAtualizados, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Ação atualizada com sucesso!");
      navigate('/dashboard');
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
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
            <label>Quantidade</label>
            <input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
            <label>Preço Médio</label>
            <input type="text" value={pm} onChange={e => setPm(formatarMoeda(e.target.value))} required />
            <label>Preço Médio IR</label>
            <input type="text" value={pmIr} onChange={e => setPmIr(formatarMoeda(e.target.value))} required />
            <label>Dividendos</label>
            <input type="text" value={dividendos} onChange={e => setDividendos(formatarMoeda(e.target.value))} required />
            <label>Total Investido</label>
            <input type="text" value={totalInv} readOnly className="input-readonly" />
          </div>
          
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