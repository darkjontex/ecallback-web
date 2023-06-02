import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { DespacharComponent } from '../../components/despachar/despachar.component';
import { FinalizarComponent } from '../../components/finalizar/finalizar.component';
import { IncidenciaSocket } from '../../providers/incidencia.socket';

@Component({
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss'],
})
export class VisualizarComponent implements OnInit, OnDestroy {
  // --

  incidencia!: Observable<any>;

  private incidenciaId!: string;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private socket: IncidenciaSocket
  ) {
    this.socket.connect();
  }

  ngOnInit(): void {
    this.incidenciaId = this.route.snapshot.params['id'];
    this.socket.emit('getOneById', this.incidenciaId);
    this.incidencia = this.socket.fromEvent('_getOneById');
  }

  ngOnDestroy(): void {    
    this.subscriptions.forEach((e) => e.unsubscribe());
    this.socket.emit('userLeftIncidencia', {});
  }

  // --

  despachar() {
    const modalRef = this.modalService.open(DespacharComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.incidenciaId = this.incidenciaId;

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

  finalizar() {
    const modalRef = this.modalService.open(FinalizarComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.incidenciaId = this.incidenciaId;

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
}
