import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CiclosConcluidos from './componentes/CiclosConcluidos';
import Configuracao from './componentes/Configuracao';
import Temporizador from './componentes/Temporizador';
import EstatisticasPomodoro from './componentes/EstatísticasPomodoro'; // Importe o componente de Estatísticas
import './css/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <header className="app-header">
        <h1>Pomodoro Clocker</h1>
        <nav>
          <Link to="/">Temporizador</Link>
          <Link to="/configuracao">Configurações</Link>
          <Link to="/estatisticas">Estatísticas</Link> {/* Adicione o link para Estatísticas */}
        </nav>
      </header>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Temporizador />} />
          <Route path="/configuracao" element={<Configuracao />} />
          <Route path="/ciclos" element={<CiclosConcluidos />} />
          <Route path="/estatisticas" element={<EstatisticasPomodoro />} /> {/* Rota para Estatísticas */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
