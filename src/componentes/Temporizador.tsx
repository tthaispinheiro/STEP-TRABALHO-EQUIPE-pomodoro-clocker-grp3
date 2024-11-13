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
  const [iniciado, setIniciado] = useState(false); // Flag para controlar o início do temporizador

  // Solicitar permissão para notificações
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        console.log(permission); // Pode ser "granted", "denied", ou "default"
      });
    }
  }, []); // O array vazio [] faz com que esse efeito seja executado apenas uma vez, na montagem do componente

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
      // Aumenta o contador de ciclos após o Pomodoro ser completado
      setCiclosConcluidos((prev) => prev + 1);
      setPomodorosContados((prev) => prev + 1); // Aumenta o contador de pomodoros

      // Se o número de Pomodoros for igual ao configurado para o intervalo longo, começa o intervalo longo
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
    // Contabiliza o ciclo, mas não inicia o próximo automaticamente
    setCiclosConcluidos((prev) => prev + 1); // Incrementa o número de ciclos concluídos
    setPomodorosContados((prev) => prev + 1); // Incrementa o número de pomodoros

    // Não iniciar outro ciclo automaticamente
    setIniciado(false); // Garante que o próximo ciclo só será iniciado quando o usuário clicar em "Iniciar"

    // Configura o tempo para o intervalo
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
    <div>
      <h2>Pomodoro Timer</h2>
      <p>{Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}</p>
      <button onClick={iniciarPomodoro} disabled={iniciado}>Iniciar</button>
      <button onClick={pausarPomodoro} disabled={!iniciado || emPausa}>Pausar</button>
      <button onClick={finalizarPomodoro} disabled={!iniciado}>Finalizar</button>
      <h3>Ciclos Concluídos: {ciclosConcluidos}</h3> {/* Exibe o número de ciclos concluídos */}
      <h3>Pomodoros Contados: {pomodorosContados}</h3> {/* Exibe o número de Pomodoros concluídos */}
      
      {/* Botão para consultar estatísticas */}
      <button onClick={() => alert(`Ciclos Concluídos: ${ciclosConcluidos}\nPomodoros Contados: ${pomodorosContados}`)}>
        Ver Estatísticas
      </button>
    </div>
  );
};

export default PomodoroTimer;
