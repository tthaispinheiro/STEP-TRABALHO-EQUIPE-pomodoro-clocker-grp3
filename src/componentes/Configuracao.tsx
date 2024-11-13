import React, { useState, useEffect } from 'react';
import api from '../api';
import { Configuracao as ConfiguracaoTipo } from '../tipos';

const Configuracao: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoTipo>({
    duracaoPomodoro: 25,
    intervaloCurto: 5,
    intervaloLongo: 15,
    pomodorosAntesIntervaloLongo: 4,
  });
  const [modalVisivel, setModalVisivel] = useState(false); // Estado para controlar a visibilidade do modal

  useEffect(() => {
    api.get('/configuracoes').then((response) => {
      setConfiguracoes(response.data);
    }).catch((error) => {
      console.error("Erro ao buscar configurações", error);
    });
  }, []);

  const salvarConfiguracoes = () => {
    api.put('/configuracoes', configuracoes)
      .then(() => {
        setModalVisivel(true); // Exibe o modal ao salvar com sucesso
        setTimeout(() => setModalVisivel(false), 3000); // Esconde o modal após 3 segundos
      })
      .catch((error) => {
        console.error("Erro ao salvar configurações", error);
      });
  };

  return (
    <div>
      <h2>Configurações</h2>
      <label>
        Duração do Pomodoro:
        <input
          type="number"
          value={configuracoes.duracaoPomodoro}
          onChange={(e) =>
            setConfiguracoes({ ...configuracoes, duracaoPomodoro: +e.target.value })
          }
        />
      </label>
      <label>
        Intervalo Curto:
        <input
          type="number"
          value={configuracoes.intervaloCurto}
          onChange={(e) =>
            setConfiguracoes({ ...configuracoes, intervaloCurto: +e.target.value })
          }
        />
      </label>
      <label>
        Intervalo Longo:
        <input
          type="number"
          value={configuracoes.intervaloLongo}
          onChange={(e) =>
            setConfiguracoes({ ...configuracoes, intervaloLongo: +e.target.value })
          }
        />
      </label>
      <label>
        Pomodoros antes do Intervalo Longo:
        <input
          type="number"
          value={configuracoes.pomodorosAntesIntervaloLongo}
          onChange={(e) =>
            setConfiguracoes({ ...configuracoes, pomodorosAntesIntervaloLongo: +e.target.value })
          }
        />
      </label>
      <button onClick={salvarConfiguracoes}>Salvar Configurações</button>

      {/* Modal */}
      {modalVisivel && (
        <div className="modal">
          <div className="modal-content">
            <p>Configurações salvas com sucesso!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracao;
