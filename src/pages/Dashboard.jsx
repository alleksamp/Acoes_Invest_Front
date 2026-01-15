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

return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        <header className="dashboard-header">
          <h1>📊 AçõesInvest</h1>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </header>

        <div className="grid-options">
          <section className="card">
            <h2>Consultas</h2>
            <button className="btn-option" onClick={() => navigate('/listagem')}>
              {carregando ? 'Buscando...' : '🔍 Visualizar carteira'}
            </button>
          </section>
        </div>
      </div>
    </div>
    );
}