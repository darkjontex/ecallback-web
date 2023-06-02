import { HttpClient } from '@angular/common/http';
import { Component, forwardRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CallbackFormComponent } from '../../../callback/components/callback/callback.component';
import { CallbackSocket } from '../../../callback/providers/incidencia.socket';
import { AvisoSocket } from '../../providers/aviso.socket';

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.scss'],
})
export class AvisosComponent implements OnInit, OnDestroy {
  @Input() incidenciaId!: string;

  form: FormGroup;

  public avisos: Observable<any> = of([]);

    // Conferencia
    status: Observable<boolean> = of(false);
    startedConference: boolean = false;
    _telefone: string = '';

  private subscriptions: Subscription[] = [];
  constructor(
    @Inject(forwardRef(() => AvisoSocket))
    private socket: AvisoSocket,
    private callbackSocket: CallbackSocket,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private toastrSrv: ToastrService
  ) {
    this.socket.connect();
    this.callbackSocket.connect();
    this.form = this.fb.group({
      aviso: ['', Validators.required],
      resultCode: ['', Validators.required],
      comments: ['', Validators.required],
    });
  }
  public avisoSelecionado?: any = null;

  ngOnInit(): void {
    if (this.incidenciaId)
      this.socket.emit('findPaginated', {
        filter: { incidenciaId: `$eq:${this.incidenciaId}` },
      });
    else this.socket.emit('findPaginated', { path: '' });

    this.avisos = this.socket.fromEvent('_findPaginated');
    this.status = this.callbackSocket.fromEvent('_startCallbackConference');
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
    this.subscriptions.forEach((e) => e.unsubscribe());
  }

  // --

  submitted = false;
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.httpClient
        .post(`${environment.api}/callback`, {
          aviso: this.form.controls['aviso'].value,
          dataInicio: new Date(),
          dataFim: new Date(),
          resultCode: this.form.controls['resultCode'].value,
          comments: this.form.controls['comments'].value,
        })
        .subscribe((res) => {
          this.submitted = false;
          this.modalService.dismissAll();
        });
    }
  }

  openModal(content: any, telefone: string, aviso?: any) {
    this.avisoSelecionado = aviso;
    this._telefone = telefone;
    this.modalService.open(content);
  }

  startCallback() {
    
    const modalRef = this.modalService.open(CallbackFormComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.aviso = this.avisoSelecionado;;

    this.subscriptions.push(
      modalRef.componentInstance.submit.subscribe((res: boolean) => {
        if (res) this.modalService.dismissAll();
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
