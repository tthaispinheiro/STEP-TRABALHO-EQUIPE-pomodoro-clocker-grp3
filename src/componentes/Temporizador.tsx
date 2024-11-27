import React, { useState, useEffect } from 'react';
import '../css/App.css';

interface Configuracoes {
  duracaoPomodoro: number;
  intervaloCurto: number;
  intervaloLongo: number;
  pomodorosAntesIntervaloLongo: number;
}

const PomodoroTimer: React.FC = () => {
  const [tempo, setTempo] = useState(25 * 60); // Duração do Pomodoro (em segundos)
  const [emPausa, setEmPausa] = useState(false); // Controla se está em pausa
  const [ciclosConcluidos, setCiclosConcluidos] = useState(0); // Ciclos concluídos
  const [pomodorosContados, setPomodorosContados] = useState(0); // Pomodoros contados
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    duracaoPomodoro: 25,
    intervaloCurto: 5,
    intervaloLongo: 15,
    pomodorosAntesIntervaloLongo: 4,
  });

  const [iniciado, setIniciado] = useState(false);

  // Lê as configurações a partir do localStorage
  useEffect(() => {
    const configuracoesSalvas = localStorage.getItem("configPomodoro");
    if (configuracoesSalvas) {
      setConfiguracoes(JSON.parse(configuracoesSalvas));
    }
  }, []);

  // Atualiza o tempo conforme as configurações
  useEffect(() => {
    setTempo(configuracoes.duracaoPomodoro * 60);
  }, [configuracoes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (iniciado && tempo > 0 && !emPausa) {
      interval = setInterval(() => {
        setTempo((prevTempo) => prevTempo - 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    if (tempo === 0) {
      setCiclosConcluidos((prev) => prev + 1);
      setPomodorosContados((prev) => prev + 1);

      // Salva as estatísticas no localStorage
      salvarEstatisticas();

      if (pomodorosContados >= configuracoes.pomodorosAntesIntervaloLongo) {
        setTempo(configuracoes.intervaloLongo * 60); // Intervalo longo
        setPomodorosContados(0);
      } else {
        setTempo(configuracoes.intervaloCurto * 60); // Intervalo curto
      }

      if (Notification.permission === "granted") {
        new Notification("Pomodoro Concluído", {
          body: `Você completou um Pomodoro! Ciclos concluídos: ${ciclosConcluidos + 1}`,
        });
      } else {
        alert(`Pomodoro Concluído! Ciclos concluídos: ${ciclosConcluidos + 1}`);
      }
    }

    return () => clearInterval(interval);
  }, [tempo, emPausa, pomodorosContados, configuracoes, iniciado, ciclosConcluidos]);

  const iniciarPomodoro = () => {
    setIniciado(true);
    setEmPausa(false); // Garante que não está em pausa ao iniciar
  };

  const pausarPomodoro = () => {
    setEmPausa(true);
  };

  const finalizarPomodoro = () => {
    setCiclosConcluidos((prev) => prev + 1);
    setPomodorosContados((prev) => prev + 1);
    setIniciado(false);
    setTempo(configuracoes.duracaoPomodoro * 60); // Resetando o tempo

    if (pomodorosContados >= configuracoes.pomodorosAntesIntervaloLongo) {
      setTempo(configuracoes.intervaloLongo * 60); // Intervalo longo
      setPomodorosContados(0);
    } else {
      setTempo(configuracoes.intervaloCurto * 60); // Intervalo curto
    }

    if (Notification.permission === "granted") {
      new Notification("Pomodoro Finalizado", {
        body: `Ciclo concluído! Ciclos concluídos: ${ciclosConcluidos + 1}`,
      });
    } else {
      alert(`Pomodoro Finalizado! Ciclos concluídos: ${ciclosConcluidos + 1}`);
    }
  };

  // Função para resetar todos os valores
  const resetarPomodoro = () => {
    setCiclosConcluidos(0); // Zera o número de ciclos
    setPomodorosContados(0); // Zera o número de pomodoros contados
    setTempo(configuracoes.duracaoPomodoro * 60); // Restaura o tempo para o valor inicial do Pomodoro
    setIniciado(false); // Garante que o cronômetro está parado
    setEmPausa(false); // Garante que o cronômetro não está pausado
  };

  // Função para salvar as estatísticas no localStorage
  const salvarEstatisticas = () => {
    const hoje = new Date().toISOString().split('T')[0]; // Pega a data no formato YYYY-MM-DD
    const estatisticasSalvas = JSON.parse(localStorage.getItem('estatisticasPomodoro') || '{}');

    estatisticasSalvas[hoje] = (estatisticasSalvas[hoje] || 0) + 1; // Incrementa o número de Pomodoros para o dia
    localStorage.setItem('estatisticasPomodoro', JSON.stringify(estatisticasSalvas));
  };

  return (
    <div className="cronometro-container">
      <h2>Pomodoro Timer</h2>
      <div className="cronometro">
        <div className="tempo">
          {Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="controles">
        <button onClick={iniciarPomodoro} disabled={iniciado}>Iniciar</button>
        <button onClick={pausarPomodoro} disabled={!iniciado || emPausa}>Pausar</button>
        <button onClick={finalizarPomodoro}>Finalizar</button>
        <button onClick={resetarPomodoro}>Resetar</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
