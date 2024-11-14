import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CiclosConcluidos from './componentes/CiclosConcluidos';
import Configuracao from './componentes/Configuracao';
import Temporizador from './componentes/Temporizador';
import './css/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <header className="app-header">
        <h1>Pomodoro Clocker</h1>
        <nav>
          <Link to="/">Temporizador</Link>
          <Link to="/configuracao">Configurações</Link>
          {/* <Link to="/ciclos">Ciclos Concluídos</Link> */}
        </nav>
      </header>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Temporizador />} />
          <Route path="/configuracao" element={<Configuracao />} />
          <Route path="/ciclos" element={<CiclosConcluidos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
