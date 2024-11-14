import React, { useState, useEffect } from 'react';
import api from '../api';

const PomodoroTimer: React.FC = () => {
  const [tempo, setTempo] = useState(25 * 60); // Duração do Pomodoro (em segundos)
  const [emPausa, setEmPausa] = useState(false); // Controla se está em pausa
  const [ciclosConcluidos, setCiclosConcluidos] = useState(0); // Ciclos concluídos
  const [pomodorosContados, setPomodorosContados] = useState(0); // Pomodoros contados
  const [configuracoes, setConfiguracoes] = useState({
    duracaoPomodoro: 25,
    intervaloCurto: 5,
    intervaloLongo: 15,
    pomodorosAntesIntervaloLongo: 4,
  });
  const [iniciado, setIniciado] = useState(false);

  // Solicitar permissão para notificações
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        console.log(permission);
      });
    }
  }, []);

  // Carregar configurações da API
  useEffect(() => {
    api.get('/configuracoes')
      .then((response) => {
        setConfiguracoes(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar configurações", error);
      });
  }, []);

  // Função do temporizador
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

      if (pomodorosContados >= configuracoes.pomodorosAntesIntervaloLongo) {
        setTempo(configuracoes.intervaloLongo * 60); // Intervalo longo
        setPomodorosContados(0); // Resetando o contador de Pomodoros
      } else {
        setTempo(configuracoes.intervaloCurto * 60); // Intervalo curto
      }

      // Exibe notificação ao completar um Pomodoro
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
    setCiclosConcluidos((prev) => prev + 1); // Incrementa o número de ciclos concluídos
    setPomodorosContados((prev) => prev + 1); // Incrementa o número de pomodoros

    setIniciado(false); // Garante que o próximo ciclo só será iniciado quando o usuário clicar em "Iniciar"

    if (pomodorosContados >= configuracoes.pomodorosAntesIntervaloLongo) {
      setTempo(configuracoes.intervaloLongo * 60); // Intervalo longo
      setPomodorosContados(0); // Resetando o contador de Pomodoros
    } else {
      setTempo(configuracoes.intervaloCurto * 60); // Intervalo curto
    }

    // Exibe notificação de finalização
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Finalizado", {
        body: `Ciclo concluído! Ciclos concluídos: ${ciclosConcluidos + 1}`,
      });
    } else {
      alert(`Pomodoro Finalizado! Ciclos concluídos: ${ciclosConcluidos + 1}`);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Pomodoro Timer</h2>
      <div style={{ fontSize: '6em', fontWeight: 'bold', margin: '20px 0' }}>
        {Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}
      </div>
      <button onClick={iniciarPomodoro} disabled={iniciado}>Iniciar</button>
      <button onClick={pausarPomodoro} disabled={!iniciado || emPausa}>Pausar</button>
      <button onClick={finalizarPomodoro} disabled={!iniciado}>Finalizar</button>
      <h3>Ciclos Concluídos: {ciclosConcluidos}</h3>
      <h3>Pomodoros Contados: {pomodorosContados}</h3>

      <button onClick={() => alert(`Ciclos Concluídos: ${ciclosConcluidos}\nPomodoros Contados: ${pomodorosContados}`)}>
        Ver Estatísticas
      </button>
    </div>
  );
};

export default PomodoroTimer;
