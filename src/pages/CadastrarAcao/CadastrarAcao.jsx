import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './CadastrarAcao.css';
import Swal from 'sweetalert2';

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

export function CadastrarAcao() {

  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pm, setPm] = useState('');
  const [pmIr, setPmIr] = useState('');
  const [dividendos, setDividendos] = useState('');
  const [totalInv, setTotalInv] = useState('');
  
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
        const qtd = parseInt(quantidade) || 0;
        const preco = converterParaDecimal(pm);
        const total = qtd * preco;
        setTotalInv(formatarMoeda((total * 100).toFixed(0)));
    }, [quantidade, pm]);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const token = localStorage.getItem('token');
      
      const novaAcao = {
        nome: nome,
        quantidade: parseInt(quantidade),
        pm: converterParaDecimal(pm),
        pmIr: converterParaDecimal(pmIr),
        dividendos: converterParaDecimal(dividendos),
        totalInv: converterParaDecimal(totalInv)
      };

      await api.post('/api/Acoes/Cadastrar', novaAcao, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        title: 'Sucesso!',
        text: 'Ação cadastrada com sucesso!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/dashboard');
        }
      });

    } catch (err) {
      console.error(err);

      Swal.fire({
      title: 'Erro no Cadastro',
      text: 'Verifique se os campos estão corretos ou se a ação já existe.',
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Tentar novamente'
    });
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
            <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required placeholder='Ex: 120' />
          </div>

          <div className="form-group">
            <label>Preço Médio</label>
            <input type="text" value={pm} onChange={(e) => setPm(formatarMoeda(e.target.value))} required placeholder='Ex: R$10,50'/>
          </div>

          <div className="form-group">
            <label>Preço Médio IR</label>
            <input type="text" value={pmIr} onChange={(e) => setPmIr(formatarMoeda(e.target.value))} required placeholder='Ex: R$12,80'/>
          </div>

          <div className="form-group">
            <label>Dividendos</label>
            <input type="text" value={dividendos} onChange={(e) => setDividendos(formatarMoeda(e.target.value))} required placeholder='Ex: R$1.250,25'/>
          </div>

          <div className="form-group full-width">
            <label>Total Investido</label>
            <input type="text" value={totalInv} readOnly className='input-readonly'/>
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