import React, { useState, useEffect } from 'react';
import api from '../api'; 

const CiclosConcluidos: React.FC = () => {
  // Inicializando ciclosConcluidos com 0 para evitar undefined
  const [ciclosConcluidos, setCiclosConcluidos] = useState<number>(0);

  useEffect(() => {
    api.get('/ciclosConcluidos')
      .then((response) => {
        console.log("Resposta da API:", response.data); // Verifique a estrutura da resposta da API
        setCiclosConcluidos(response.data.ciclosConcluidos); // Atualiza o estado com o valor da API
      })
      .catch((error) => {
        console.error("Erro ao buscar ciclos concluídos:", error);
      });
  }, []);

  return (
    <div>
      <h2>Ciclos Concluídos</h2>
      <p>{ciclosConcluidos !== null ? `Pomodoros Concluídos: ${ciclosConcluidos}` : 'Carregando...'}</p>
    </div>
  );
};

export default CiclosConcluidos;
