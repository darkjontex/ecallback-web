import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CallbackSocket } from '../../providers/incidencia.socket';

@Component({
  selector: 'app-callback-form',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackFormComponent implements OnDestroy, OnInit {
  @Input() avisoNumero!: number;
  @Input() aviso!: {numero: number; telefoneReclamante: string};
  @Input() ramal!: string;

  // --

  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() cancelar: EventEmitter<boolean> = new EventEmitter();

  form!: FormGroup;

  submitted = false;
  loading = false;

  private dataInicio!: Date;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private socket: CallbackSocket,
    private toastrSrv: ToastrService
  ) {
    this.socket.connect();
  }
  
  ngOnInit(): void {
    
    this.form = this.fb.group({
      avisoNumero: new FormControl(this.aviso?.numero || this.avisoNumero,  [Validators.required]),
      resultCode: new FormControl('', [Validators.required]),
      comments: new FormControl('', [Validators.required]),
    });    

    this.subscriptions.push(
      this.socket.fromEvent('_createHumanCallback').subscribe((res) => {
        if (res) {
          this.submit.emit(true);
          this.loading = false;
          this.toastrSrv.success('Callback registrado com sucesso');
        } else {
          this.loading = false;
          this.toastrSrv.error('Falha ao registrar callback');
        }
      })
    );

    this.dataInicio = new Date();
  }
  
  ngOnDestroy(): void {
    this.socket.disconnect();
    this.subscriptions.forEach((e) => e.unsubscribe());
  }

  // --

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) return;

    this.loading = true;

    this.socket.emit('createHumanCallback', {
      avisoNumero: this.form.controls['avisoNumero'].value,
      dataInicio: this.dataInicio,
      dataFim: new Date(),
      resultCode: this.form.controls['resultCode'].value,
      comments: this.form.controls['comments'].value,
    });
  }

  onCancelar() {
    this.form.markAsPristine();
    this.cancelar.emit(true);
  }
}
