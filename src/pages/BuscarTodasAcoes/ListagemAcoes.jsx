import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Swal from 'sweetalert2';
import './ListagemAcoes.css';

export function ListagemAcoes() {
    const [acoes, setAcoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    const carregarTudo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/api/Acoes/Listar', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAcoes(response.data);
        } catch (err) {
            Swal.fire('Erro', 'Não foi possível carregar o patrimônio.', 'error');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarTudo(); }, []);

    const deletarAcao = async (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter esta ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
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
                    Swal.fire('Excluído!', 'A ação foi deletada com sucesso.', 'success');
                    carregarTudo(); 
                } catch (err) {
                    Swal.fire('Erro!', 'Não foi possível excluir a ação.', 'error');
                }
            }
        });
    };

    const totalPatrimonio = acoes.reduce((acc, curr) => acc + (curr.totalInv || 0), 0);
    const totalDividendos = acoes.reduce((acc, curr) => acc + (curr.dividendos || 0), 0);
    const totalAtivos = acoes.length;

    const formatar = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (carregando) return <div className="loading">Carregando Ativos...</div>;

    return (
        <div className="listagem-container">
            <header className="listagem-header">
                <div className="header-content">
                    <h1>💰 Meu Patrimônio</h1>
                    <p>Visão geral de todos os seus investimentos ativos</p>
                </div>
                <button className="btn-voltar" onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</button>
            </header>

            <div className="resumo-grid">
                <div className="resumo-card">
                    <span>Total Investido</span>
                    <h3>{formatar(totalPatrimonio)}</h3>
                </div>
                <div className="resumo-card highlight">
                    <span>Total em Dividendos</span>
                    <h3>{formatar(totalDividendos)}</h3>
                </div>
                <div className="resumo-card">
                    <span>Ativos na Carteira</span>
                    <h3>{totalAtivos} Ativos</h3>
                </div>
            </div>

            <div className="tabela-container">
                <table className="listagem-table">
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
                        {acoes.map(acao => (
                            <tr key={acao.id || acao.Id}>
                                <td className="ticker">{acao.nome}</td>
                                <td>{acao.quantidade}</td>
                                <td>{formatar(acao.pm)}</td>
                                <td>{formatar(acao.pmIr)}</td>
                                <td className="div-yield">{formatar(acao.dividendos)}</td>
                                <td>{formatar(acao.totalInv)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="btn-editar" 
                                            onClick={() => navigate(`/editar/${acao.id || acao.Id}`)}>
                                            Editar
                                        </button>
                                        <button 
                                            className="btn-excluir" 
                                            onClick={() => deletarAcao(acao.id || acao.Id)}>
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}