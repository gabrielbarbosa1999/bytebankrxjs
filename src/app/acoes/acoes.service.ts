import { Acoes, Acao, AcoesAPI } from './modelo/acoes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, pluck, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AcoesService {

  constructor(private httpClient: HttpClient) { }

  //OBSERVABLE
  //Representa uma coleção de eventes ou valores que ocorre no tempo, a melhor apresentação de um observable e um cano, que passa valores ou objetos
  //o get Acoes retorna um valor de uma requisição e para obtelo nos escrevemos ao observable com o subscribe


  //Valor e opcional
  getAcoes(valor?: string) {
    //Ao digitar no input sera gerado a busca usando o httpclient
    //Se tiver um valor ira continuar, se nao tiver valor sera undefine ae busca todos
    const params = valor ? new HttpParams().append('valor', valor) : undefined;

    //Ordenar as ações pelos codigos da ação
    //Para manipular o fluxo de informaçoes usamos o metodo pipe
    //Usamos o operador Map para para ordenar
    //Map recebe como parametro o dado que vem do fluxo e que espera como retorno como objetos que neste caso e o mesmo array de acoes porem ordenado
    //Sort = Espera uma função de ordeção que recebe um par de obejtos

    //tap = Para ver o que esta acontecendo para ver o fluxo do observable
    return this.httpClient.get<AcoesAPI>('http://localhost:3000/acoes', { params }).pipe(
      tap((valor) => console.log(valor)),
      //Removendo o atributo q esta dentro do objeto e trazendo ela para o fluxo
      //map((api) => api.payload),
      //Faz a mesma coisa so que mais simples com codigo mais limpo sem ter q usar o map
      pluck('payload'),
      map((acoes) =>
        acoes.sort((acaoA, acaoB) =>  this.ordenaPorCodigo(acaoA, acaoB)))
      );
  }

  private ordenaPorCodigo(a: Acao, b: Acao) {
    if(a.codigo > b.codigo) {
      return 1;
    }

    if(a.codigo < b.codigo) {
      return -1;
    }
    return 0;
  }
}
