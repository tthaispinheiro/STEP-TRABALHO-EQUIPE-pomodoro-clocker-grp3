import React, { useState } from "react";

interface Configuracoes {
  duracaoPomodoro: number;
  intervaloCurto: number;
  intervaloLongo: number;
  pomodorosAntesIntervaloLongo: number;
}

const ConfiguracoesPomodoro: React.FC = () => {
  const carregarConfiguracoes = (): Configuracoes => {
    const configuracoesSalvas = localStorage.getItem("configPomodoro");
    return configuracoesSalvas
      ? JSON.parse(configuracoesSalvas)
      : { duracaoPomodoro: 25, intervaloCurto: 5, intervaloLongo: 15, pomodorosAntesIntervaloLongo: 4 };
  };

  const [config, setConfig] = useState<Configuracoes>(carregarConfiguracoes);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: Number(value) }); // Atualiza o estado com o novo valor
  };

  const salvarConfiguracoes = () => {
    localStorage.setItem("configPomodoro", JSON.stringify(config)); // Salvar as configurações no localStorage
    alert("Configurações salvas!");
  };

  return (
    <div className="configuracoes-container">
      <h2>Configurações</h2>
      <form>
        <label>
          Duração Pomodoro (minutos):
          <input
            type="number"
            name="duracaoPomodoro"
            value={config.duracaoPomodoro}
            onChange={handleChange}
          />
        </label>
        <label>
          Pausa Curta (minutos):
          <input
            type="number"
            name="intervaloCurto"
            value={config.intervaloCurto}
            onChange={handleChange}
          />
        </label>
        <label>
          Pausa Longa (minutos):
          <input
            type="number"
            name="intervaloLongo"
            value={config.intervaloLongo}
            onChange={handleChange}
          />
        </label>
        <label>
          Pomodoros antes do intervalo longo:
          <input
            type="number"
            name="pomodorosAntesIntervaloLongo"
            value={config.pomodorosAntesIntervaloLongo}
            onChange={handleChange}
          />
        </label>
        <button type="button" onClick={salvarConfiguracoes}>
          Salvar Configurações
        </button>
      </form>
    </div>
  );
};

export default ConfiguracoesPomodoro;
