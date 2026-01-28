import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Swal from 'sweetalert2';
import './CadastrarUsuario.css';

export function CadastroUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();


    const handleCadastro = async (e) => {
        e.preventDefault();
        setCarregando(true);

        try {
            await api.post('/Usuarios/Cadastrar', {
                nome: nome,
                email: email,
                senha: senha
            });

            Swal.fire({
                title: 'Sucesso!',
                text: 'Usuário cadastrado com sucesso.',
                icon: 'success',
                confirmButtonColor: '#10b981'
            });
            navigate('/');

        } catch (err) {
            Swal.fire({
                title: 'Erro',
                text: err.response?.data?.message || 'Erro ao cadastrar usuário.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            navigate('/CadastroUsuario');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="cadastro-container">
            <div className="cadastro-card">
                <header className="cadastro-header">
                    <h2>Novo Cadastro</h2>
                </header>

                <form onSubmit={handleCadastro} className="cadastro-form">
                    <div className="form-group-usuario">
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            placeholder="Ex: João Silva"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-usuario">
                        <label>E-mail</label>
                        <input
                            type="email"
                            placeholder="joao@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-usuario">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className="acoes-form">
                        <button type="submit" className="btn-salvar" disabled={carregando}>
                            {carregando ? 'Salvando...' : 'Confirmar Cadastro'}
                        </button>
                        <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}