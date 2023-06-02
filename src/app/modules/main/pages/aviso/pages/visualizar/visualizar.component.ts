import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, of } from 'rxjs';
import { CallbackFormComponent } from '../../../callback/components/callback/callback.component';
import { CallbackSocket } from '../../../callback/providers/incidencia.socket';
import { AvisoSocket } from '../../providers/aviso.socket';

@Component({
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss'],
})
export class VisualizarComponent implements OnInit, OnDestroy {

  public aviso: Observable<any> = of(null);
  private avisoNumero!: number;
  private subscriptions: Subscription[] = [];

  // Conferencia
  status: Observable<boolean> = of(false);
  startedConference: boolean = false;
  _telefone: string = '';

  constructor(
    private route: ActivatedRoute,
    private socket: AvisoSocket,
    private callbackSocket: CallbackSocket,
    private modalService: NgbModal,
    private toastrSrv: ToastrService
  ) {
    this.socket.connect();
    this.callbackSocket.connect();
    this.avisoNumero = this.route.snapshot.params['numero'];
  }  

  ngOnInit(): void {
    this.socket.emit('getOneByNumero', this.avisoNumero);
    this.aviso = this.socket.fromEvent('_getOneByNumero');
    this.status = this.callbackSocket.fromEvent('_startCallbackConference');
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
    this.subscriptions.forEach((e) => e.unsubscribe());
  }

  openModal(content: any, telefone: string) {
    this.modalService.open(content);
    this._telefone = telefone;
  }


  startCallback() {
    
    const modalRef = this.modalService.open(CallbackFormComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.avisoNumero = this.avisoNumero;

    this.subscriptions.push(
      modalRef.componentInstance.submit.subscribe((res: boolean) => {
        if (res) {
          this.modalService.dismissAll();
          if (this.startedConference) this.startedConference = false;
        };
      })
    );

    this.subscriptions.push(
      modalRef.componentInstance.cancelar.subscribe((res: boolean) => {
        if (res) this.modalService.dismissAll();
      })
    );
  }

  startConference(tel: string) {
    this.startedConference = true;
        
    this.modalService.dismissAll();
    this.callbackSocket.emit('startCallbackConference', {
      origem: localStorage.getItem('RAMAL'),
      destino: tel
    });
  }

  cancelConference() {
    // this.toastrSrv.toastrConfig.timeOut = 10000;
    // this.toastrSrv.toastrConfig.extendedTimeOut = 10000;
    this.toastrSrv.toastrConfig.enableHtml = true;
    this.toastrSrv.toastrConfig.positionClass = 'toast-top-center';
    this.toastrSrv.info('Esta ação <b>não encerra</b> a ligação em curso pela URA.', 'Fim da conferância');
    
    this.startedConference = false;
  }
}
