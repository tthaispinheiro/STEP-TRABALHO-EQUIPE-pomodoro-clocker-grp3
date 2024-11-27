import React, { useState, useEffect } from 'react';

// Função para filtrar as estatísticas por período
const filtrarEstatisticasPorPeriodo = (estatisticas: { [key: string]: number }, periodo: number) => {
  const hoje = new Date();
  const dataLimite = new Date(hoje);
  dataLimite.setDate(hoje.getDate() - periodo); // Ajusta para o número de dias passado no período

  const estatisticasFiltradas: { [key: string]: number } = {};

  Object.keys(estatisticas).forEach((dia) => {
    const dataDia = new Date(dia);
    if (dataDia >= dataLimite) {
      estatisticasFiltradas[dia] = estatisticas[dia];
    }
  });

  return estatisticasFiltradas;
};

const EstatisticasPomodoro: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<{ [key: string]: number }>({});
  const [periodo, setPeriodo] = useState<number>(7); // Período de 7 dias por padrão

  useEffect(() => {
    const estatisticasSalvas = JSON.parse(localStorage.getItem('estatisticasPomodoro') || '{}');
    setEstatisticas(estatisticasSalvas);
  }, []);

  // Calcular o dia mais produtivo
  const calcularDiaMaisProdutivo = () => {
    let diaMaisProdutivo = '';
    let maiorNumeroPomodoros = 0;

    for (const dia in estatisticas) {
      if (estatisticas[dia] > maiorNumeroPomodoros) {
        maiorNumeroPomodoros = estatisticas[dia];
        diaMaisProdutivo = dia;
      }
    }

    return { diaMaisProdutivo, maiorNumeroPomodoros };
  };

  // Filtrar as estatísticas com base no período
  const estatisticasFiltradas = filtrarEstatisticasPorPeriodo(estatisticas, periodo);

  return (
    <div className="estatisticas-container">
      <h2>Estatísticas do Pomodoro</h2>
      <div>
        <label>Período (dias): </label>
        <input
          type="number"
          value={periodo}
          onChange={(e) => setPeriodo(Number(e.target.value))}
        />
      </div>
      <div>
        <h3>Estatísticas Recentes</h3>
        <ul>
          {Object.keys(estatisticasFiltradas).map((dia) => (
            <li key={dia}>
              {dia}: {estatisticasFiltradas[dia]} Pomodoros
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Dia Mais Produtivo</h3>
        <p>
          {calcularDiaMaisProdutivo().diaMaisProdutivo} com {calcularDiaMaisProdutivo().maiorNumeroPomodoros} Pomodoros
        </p>
      </div>
    </div>
  );
};

export default EstatisticasPomodoro;
