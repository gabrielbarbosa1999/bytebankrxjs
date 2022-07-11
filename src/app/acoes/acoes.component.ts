//import { Subscription } from 'rxjs';
import { AcoesService } from './acoes.service';
//import { Acoes } from './modelo/acoes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { switchMap, tap, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge } from 'rxjs';

//Mile segundos
const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent /*implements OnInit, OnDestroy*/ {
  acoesInput = new FormControl();

  //Atributo que representa o fluxo inicial de todas ações
  todasAcoes$ = this.acoesService.getAcoes();

  //filter = faz com que o fluxo so va para a proxima fase somente se uma codição for atendida

  //Atributo que representa os dados filtrados para acoes
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
  //Recebe a quantidade em milesegundo que o fluxo deve esperar para emitir para o proximo operador o ultimo valor que foi gerado neste intervalo
  debounceTime(ESPERA_DIGITACAO),
  //Controlando o filtro para fazer somente quando atigir a condição
  filter(
    (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
  ),
  //Este operador evita requição duplicada, armazena o valor digitado, compara com o novo valor e caso seja igual nao envia a requisição
  distinctUntilChanged(),
  //Ele enviar para a função internar passa o valor que esta vindo do pipe e retorna o valor
  switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado)),
  //tap(console.log)
  );

  //switchMap para o primeiro fluxo e troca pelo novo fluxo que representa a requisição da API
  //merge faz a flusao dos dois fluxo em um so

  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  //Caso não fecharmos o observable corretamente o front end pode haver vazamento de memoria
  //private subscription: Subscription;
  //acoes: Acoes;

  //JA QUE ESTAMOS USANDO PIPE ASYNC NÃO E NECESARIO FAZER A SUBSCRITION
  //acoes$ = this.acoesService.getAcoes();

  /*
  AGORA ESTOU USANDO ESTAS MESMAS VALIDACOES NOS ATRIBUTOS

  //Alterando o observable para receber os dados do input
  acoes$ = this.acoesInput.valueChanges.pipe(tap(console.log),
  //Ele enviar para a função internar passa o valor que esta vindo do pipe e retorna o valor
  switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado)),
  tap(console.log)
  );

  */

  //A requesição so sera realizada quando o componente for aberto e o pipe async faz o subscribe


  constructor(private acoesService: AcoesService) {}

  /*
  //JA QUE ESTAMOS USANDO PIPE ASYNC NÃO E NECESARIO FAZER A SUBSCRITION
  //Então não a necessidade de realizar o OnInit nem o onDestroy
  ngOnInit() {
    //subscribe faz a interação com o dado que o http client retorna

    //OBSERVABLE
    //Representa uma coleção de eventes ou valores que ocorre no tempo, a melhor apresentação de um observable e um cano, que passa valores ou objetos
    //o get Acoes retorna um valor de uma requisição e para obtelo nos escrevemos ao observable com o subscribe




    JA QUE ESTAMOS USANDO PIPE ASYNC NÃO E NECESARIO FAZER A SUBSCRITION
    this.subscription = this.acoesService.getAcoes().subscribe((acoes) => {
      this.acoes = acoes;
    })

  }

  ngOnDestroy() {
    //Assim garantimos que a subscrição que fizemos no onInit seja finalizada quando o componente sair da memoria
    this.subscription.unsubscribe;
  }
  */
}
