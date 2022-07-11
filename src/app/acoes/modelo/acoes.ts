//Falando que ações e um array de ação
export interface Acoes extends Array<Acao>{
}

export interface Acao {
  id: number;
  codigo: string;
  descricao: string;
  preco: number;
}

//A API entre esta propiedade dentro chamada PayLoad
export interface AcoesAPI {
  payload: Acoes;
}
