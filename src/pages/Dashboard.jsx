import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Dashboard.css';
import Swal from 'sweetalert2';
import MarketWidget from '../components/MarketWidget/MarketWidget';


export function Dashboard() {

    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
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
            <h2>Seja bem-vindo ao <strong>AçõesInvest</strong></h2>
            <h2>Acompanhe os seus investimentos</h2>
            <button className="btn-option" onClick={() => navigate('/listagem')}>
              {carregando ? 'Buscando...' : '🔍 Visualizar carteira'}
            </button>
          </section>
        </div>

        <MarketWidget />
                <div className="acoes-table-container">
                    {/* Aqui entrará sua listagem de ações salvas no banco */}
                </div>

      </div>
    </div>
    );
}