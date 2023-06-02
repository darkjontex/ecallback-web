import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppSocket } from './providers/app.socket';
import { CallbackAutomaticoSocket } from './providers/callback-automatico.socket';
import { ComunicacaoProativaSocket } from './providers/comunicacao-proativa.socket';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public enviando = 0;
  public processando = 0;
  public finalizado = 0;
  public numeroErrado = '0.00%';
  public semRetornoUra = '0.00%';
  public total = 0;

  // comunicacao proativa
  public enviados = 0;
  public recebidos = 0;

  // health
  public apiHealth = 0;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private callbackAutomaticoSocket: CallbackAutomaticoSocket,
    private comunicacaoProativaSocket: ComunicacaoProativaSocket,
    private appSocket: AppSocket) {
      
    this.callbackAutomaticoSocket.connect();
    this.comunicacaoProativaSocket.connect();
    this.appSocket.connect();

    this.callbackAutomaticoSocket.emit('statsCallbackAutomatico', null);
    this.comunicacaoProativaSocket.emit('statsComunicacaoProativa', null);
    this.comunicacaoProativaSocket.emit('apiHealth', null);

  }

  ngOnInit(): void {
    this.subscriptions.push(this.callbackAutomaticoSocket.fromEvent('_statsCallbackAutomatico').subscribe((res: any) => {
      const {enviando, processando, finalizado, numeroErrado, semRetornoUra, total} = res;
      this.enviando = enviando;
      this.processando = processando;
      this.finalizado = finalizado;
      this.semRetornoUra = semRetornoUra;
      this.numeroErrado = numeroErrado;
      this.total = total;
    }));

    this.subscriptions.push(this.comunicacaoProativaSocket.fromEvent('_statsComunicacaoProativa').subscribe((res: any) => {
      const {recebidos, enviados} = res;
      this.recebidos = recebidos;
      this.enviados = enviados;
    }));

    this.subscriptions.push(this.appSocket.fromEvent('_apiHealth').subscribe((res: any) => {      
      this.apiHealth = res;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(e => e.unsubscribe());
    this.callbackAutomaticoSocket.disconnect();
    this.comunicacaoProativaSocket.disconnect();
    this.appSocket.disconnect();
  }


}
