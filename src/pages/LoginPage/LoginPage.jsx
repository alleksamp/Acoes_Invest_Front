import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Swal from 'sweetalert2';

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
    const response = await api.post('/Login/login', {
      email: email,
      senha: senha
      });

      console.log("Resposta da API:", response.data);

      const { token, nomeUsuario } = response.data;
      localStorage.setItem('@AcoesInvest:token', token);
      localStorage.setItem('@AcoesInvest:userName', nomeUsuario);

      Swal.fire({
          title: 'Bem-vindo!',
          text: 'Login realizado com sucesso.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ir para o Dashboard'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard');
          }
        });
      
      } catch (err) {
        console.error(err);
        
        Swal.fire({
          title: 'Falha no Login',
          text: err.response?.data?.message || 'E-mail ou senha incorretos.',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Tentar novamente'
        });
        
        setErro(err.response?.data?.message || 'Erro ao conectar com o servidor');
      } finally {
        setCarregando(false);
      }
    }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Ações Invest</h2>
        
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
          <div className='msg'>
            <p className='msg1' >Não possui uma conta?</p>
            <p className='msg2' onClick={() => navigate ('/cadastrarUsuario')} > Cadastre-se </p>
          </div>
        </form>
      </div>      
    </div>
  );
};

export default LoginPage;