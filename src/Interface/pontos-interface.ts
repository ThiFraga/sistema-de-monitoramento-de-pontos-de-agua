export interface IPontos {
  id?: string;
  tipo_ponto: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  data_coleta: string;
  responsavel?: string;
  ph: number;
  turbidez: number;
  temperatura: number;
  condicoes_entorno: string;
  observacoes?: string;
}
