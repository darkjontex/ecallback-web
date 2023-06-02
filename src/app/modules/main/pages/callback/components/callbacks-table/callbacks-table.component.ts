import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { CallbackSocket } from '../../providers/incidencia.socket';

@Component({
  selector: 'app-callbacks-table',
  templateUrl: './callbacks-table.component.html',
  styleUrls: ['./callbacks-table.component.scss'],
})
export class CallbacksTableComponent implements OnInit, OnDestroy {
  @Input() avisoNumero!: number;
  @Input() ordem!: string;
  @Input() _filter = {};
  
  public showAll = false;
  public callbacks: Observable<any> = of([]);
  public selectedItemsPerPage = 15;
  public isLoading = false;
  public _socket!: CallbackSocket;
  public filter: any;

  private subscriptions: Subscription[] = [];

  constructor(private socket: CallbackSocket) {
    this.socket.connect();
    this._socket = this.socket;
  }

  ngOnInit(): void {        
    if (this.avisoNumero) {
      this.filter = { avisoNumero: `$eq:${this.avisoNumero}` };
    } else if (this.ordem) {
      this.filter = { ordem: `$eq:${this.ordem}` };
    } else {
      this.filter = this._filter;
    }

    this.socket.emit('findPaginated', { filter: this.filter });
    this.callbacks = this.socket.fromEvent('_findPaginated');
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
    this.subscriptions.forEach((e) => e.unsubscribe());
  }

  itemsPerPage(limit: number){
    this.socket.emit('findPaginated', {limit, filter: this.filter});
  }
  
  pageChange(page: number){
    this.socket.emit('findPaginated', {page, filter: this.filter});
  }

}
