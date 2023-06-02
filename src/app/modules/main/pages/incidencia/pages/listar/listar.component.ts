import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { IncidenciaSocket } from '../../providers/incidencia.socket';

@Component({
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarComponent implements OnInit, OnDestroy {
  public incidencias: Observable<any> = of([]);
  public filterData: Observable<any> = of([]);
  public selectedItemsPerPage = 15;

  public _filtro = {};
  public _socket!: IncidenciaSocket;

  constructor(private socket: IncidenciaSocket) {
    this.socket.connect();
    this._socket = this.socket;
  }

  ngOnInit(): void {
    this.socket.emit('findPaginated', this._filtro);
    this.socket.emit('filterData', null);
    this.incidencias = this.socket.fromEvent('_findPaginated').pipe(
      map((array: any) => {
        // verificar solução
        const token = localStorage.getItem('access_token');
        if(token){
        const jwt = 
          JSON.parse(atob(token.split('.')[1]));
          array.data.forEach((obj: any) => {
            if (obj.activeUser === jwt.username) {
              obj.activeUser = '';
            }
          });
        }
        return array;
      })
    );
    this.filterData = this.socket.fromEvent('_filterData');
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
