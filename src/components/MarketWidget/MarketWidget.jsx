import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MarketWidget.css';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MarketWidget = () => {
    const [altas, setAltas] = useState([]);
    const [baixas, setBaixas] = useState([]);
    const [ibov, setIbov] = useState(null);
    const [historicoIbov, setHistoricoIbov] = useState([]);
    const [loading, setLoading] = useState(true);


    const API_TOKEN = '4Ui3QbupX5Qaj7jmxZeEAh'; 

    useEffect(() => {

        const fetchIbovHistory = async () => {
        try {
        const res = await axios.get(`https://brapi.dev/api/quote/PETR4?range=1d&interval=15m&token=${API_TOKEN}`);
        const historicalData = res.data.results[0].historicalDataPrice;
        
        const formattedData = historicalData.map(item => ({
            hora: new Date(item.date * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            valor: item.close
        }));
        setHistoricoIbov(formattedData);
        console.log("Dados do Gráfico:", formattedData);
        } catch (e) { console.error(e); }
};

        const fetchData = async () => {
            try {
                const resIbov = await axios.get(`https://brapi.dev/api/quote/%5EBVSP?token=${API_TOKEN}`);
                setIbov(resIbov.data.results[0]);

                const resStocks = await axios.get(`https://brapi.dev/api/quote/list?token=${API_TOKEN}`);
                let allStocks = resStocks.data.stocks;

                const topGainers = [...allStocks].sort((a, b) => b.change - a.change).slice(0, 5);
                const topLosers = [...allStocks].sort((a, b) => a.change - b.change).slice(0, 5);

                setAltas(topGainers);
                setBaixas(topLosers);
                setLoading(false);

            } catch (error) {
                console.error("Erro ao buscar dados da B3:", error);
                setLoading(false);
            }
        };

        fetchIbovHistory();
        fetchData();
    }, []);

    if (loading) return <div className="loading-widget">Carregando dados da B3...</div>;

    return (
        <div className="market-trends-container">
            <div className="ibov-card">
                <h3>Ibovespa</h3>
                {ibov && (
                    <div className="ibov-data">
                        <span className="points">{ibov.regularMarketPrice.toLocaleString('pt-BR')} pontos</span>
                        <span className={`badge ${ibov.regularMarketChangePercent > 0 ? 'up' : 'down'}`}>
                            {ibov.regularMarketChangePercent.toFixed(2)}%
                        </span>
                    </div>
                )}
                <p className='grafico-petra'>Gráfico PETR4</p>

            <div className="chart-container">
                {historicoIbov.length > 0 ? ( 
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicoIbov}>
                <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip />
                <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#d4af37" 
                    fillOpacity={1} 
                    fill="url(#colorValor)" 
                    dot={false}
                />
            </AreaChart>
        </ResponsiveContainer>
            ) : (
            <p>Carregando dados...</p>
        )}

    </div>
            </div>

            <div className='trends-wrapper' >
            <div className="trend-column">
                <h3 className="trend-title altas">Maiores Altas <span>▲</span></h3>
                {altas.map((acao) => (
                    <div key={acao.stock} className="trend-item">
                        <span className="ticker">{acao.stock}</span>
                        <span className="change positive">+{acao.change.toFixed(2)}%</span>
                        <span className="price">R$ {acao.close.toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="trend-column">
                <h3 className="trend-title baixas">Maiores Baixas <span>▼</span></h3>
                {baixas.map((acao) => (
                    <div key={acao.stock} className="trend-item">
                        <span className="ticker">{acao.stock}</span>
                        <span className="change negative">{acao.change.toFixed(2)}%</span>
                        <span className="price">R$ {acao.close.toFixed(2)}</span>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default MarketWidget;