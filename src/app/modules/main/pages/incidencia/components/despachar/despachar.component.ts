import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IncidenciaSocket } from '../../providers/incidencia.socket';

@Component({
  selector: 'app-despachar',
  templateUrl: './despachar.component.html',
  styleUrls: ['./despachar.component.scss'],
})
export class DespacharComponent implements OnInit, OnDestroy {
  // --

  @Input() incidenciaId!: string | Array<string>;

  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() cancelar: EventEmitter<boolean> = new EventEmitter();

  form: FormGroup;

  submitted: boolean = false;
  loading: boolean = false;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private socket: IncidenciaSocket,
    private toastrSrv: ToastrService
  ) {
    this.form = this.fb.group({
      comments: ['', Validators.required],
    });
    this.socket.connect();
  }

  // --

  ngOnInit(): void {
    this.subscriptions.push(
      this.socket.fromEvent('_despacharIncidencia').subscribe((res) => {
        if (res) {
          this.submit.emit(true);
          this.loading = false;
          this.toastrSrv.success('incidencia despachada com sucesso');
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((e) => e.unsubscribe());
    this.socket.disconnect();
  }

  // --

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) return;

    this.loading = true;

    this.socket.emit('despacharIncidencia', {
      incidenciaId: this.incidenciaId,
      comments: this.form.controls['comments'].value,
    });
  }

  onCancelar() {
    this.form.markAsPristine();
    this.cancelar.emit(true);
  }
}
