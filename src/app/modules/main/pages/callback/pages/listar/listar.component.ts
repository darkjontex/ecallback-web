import { Component, OnInit } from '@angular/core';
import {
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { CallbackSocket } from '../../providers/incidencia.socket';

@Component({
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarComponent implements OnInit{
  public _socket: any;
  public _meta: any;
  public _filtro = {};
  public _filtroExcel = {}

  hoveredDate: NgbDate | null = null;
  // fromDate: NgbDate | null;
  // toDate: NgbDate | null;

  public callbacks: Observable<any> = of([]);
  public callbacksExcel: any = [];

  constructor(private socket: CallbackSocket) {
    this.socket.connect();
    this._socket = this.socket;
  }

  ngOnInit(): void {
    this._socket.emit('findPaginated', this._filtro);
    this.callbacks = this._socket.fromEvent('_findPaginated');

    this._socket.emit('find', this._filtroExcel);
    this._socket.fromEvent('_find').subscribe((res: any) => this.callbacksExcel = res );
  }

  getFiltro(value: {}) {    
    this._filtro = value;
    this._filtroExcel = this.getDatesFromFilter();  
    this._socket.emit('find', this._filtroExcel); 
    this._socket.fromEvent('_find').subscribe((res: any) => this.callbacksExcel = res );
  }

  getDatesFromFilter() {
    let dtIni, dtFim;
    dtIni = JSON.stringify(this._filtro).replace('{"dataInicio":"$btw:', '').replace('"}', '');
    dtFim = dtIni.slice(25);
    dtIni = dtIni.slice(0, 24);
    return {di: dtIni, df: dtFim};
  }
  
  fnSocket($event: any) {
    this._socket = $event;    
  }

  fnMeta($event: any) {
    this._meta = $event;
  }
  
  exportExcel(): void {
    this._socket.emit('');
    
    /* pass here the table id */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `callbacks-${new Date().getTime()}.xlsx`);
  }


}
