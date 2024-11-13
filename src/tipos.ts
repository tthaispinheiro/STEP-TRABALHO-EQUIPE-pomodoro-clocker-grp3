// src/tipos.ts
export interface Configuracao {
  duracaoPomodoro: number;
  intervaloCurto: number;
  intervaloLongo: number;
  pomodorosAntesIntervaloLongo: number;
}

export interface Ciclo {
  ciclosConcluidos: number;
}
