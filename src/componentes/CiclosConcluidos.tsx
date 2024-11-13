import React, { useState, useEffect } from 'react';
import api from '../api'; 

const CiclosConcluidos: React.FC = () => {
  const [ciclosConcluidos, setCiclosConcluidos] = useState<number>(0);

  useEffect(() => {
    api.get('/ciclosConcluidos')
      .then((response) => {
        console.log("Resposta da API:", response.data); 
        setCiclosConcluidos(response.data.ciclosConcluidos); 
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
