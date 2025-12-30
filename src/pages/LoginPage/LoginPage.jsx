import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Importando o novo CSS

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const response = await api.post('/api/Login/login', {
        email: email,
        senha: senha
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      alert('Login realizado com sucesso!');
      navigate('/dashboard'); 
      
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Ações Invest</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p className="error-message">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="btn-login"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;