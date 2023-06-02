import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { diff, updatedDiff } from 'deep-object-diff';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ParametrosSocket } from './providers/parametros.socket';

const validateRule = (pValue: any, cRule: any, cRuleValue: any) => {
  let comp = false;
  pValue = typeof pValue === 'boolean' && pValue ? 'TRUE' : 'FALSE';

  switch (cRule) {
    case '===':
      comp = cRuleValue === pValue;
      break;
    case '!==':
      comp = cRuleValue !== pValue;
      break;
    case '>':
      comp = cRuleValue > pValue;
      break;
    case '>=':
      comp = cRuleValue >= pValue;
      break;
    case '<':
      comp = cRuleValue < pValue;
      break;
    case '<=':
      comp = cRuleValue <= pValue;
      break;
    default:
      comp = false;
      break;
  }

  return comp;
};

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss'],
})
export class ParametrosComponent implements OnInit, OnDestroy {
  form: FormGroup;

  submitted = false;
  loading = false;
  error = false;
  hasChange = false;
  parametros: Array<any> = [];

  private childChange = false;
  private subscriptions: Array<Subscription> = [];
  private _formValue!: any;

  constructor(
    private socket: ParametrosSocket,
    private fb: FormBuilder,
    private toastrSrv: ToastrService
  ) {
    this.socket.connect();
    this.form = this.fb.group({});

    // --

    this.subscriptions.push(
      this.socket.fromEvent('_getAllParams').subscribe({
        next: (res: any) => {
          res.map((a: any) => {
            const label = a.label;
            let value = a.value;
            if (a.type === 'boolean') value = value === 'TRUE' ? true : false;
            if (a.type === 'datetime') value = (new DatePipe('pt-BR')).transform(value, 'dd/MM/YYYY HH:mm:ss');
            if (!this.form.get(label)) {
              this.parametros.push(a);
              this.form.addControl(label, new FormControl(value));
            } else this.form.get(label)?.setValue(value);
            if(a.disabled)
              this.form.get(label)?.disable();
          });
        },
      })
    );

    let _old = {};

    this.subscriptions.push(
      this.form.valueChanges.subscribe((res) => {
        // --

        const _new = updatedDiff(this._formValue, res);

        if (Object.keys(diff(_old, _new)).length > 0 && this._formValue) {
          _old = Object.assign({}, _new);

          if (_new && Object.keys(_new).length > 0) {
            const children = this.parametros.filter(
              (p) =>
                p.conditionalRef &&
                p.conditionalRef.label === Object.keys(_new)[0]
            );

            children.map((c) => {
              if (
                validateRule(
                  Object.values(_new)[0],
                  c.conditionalRule,
                  c.conditionalValue
                )
              ) {
                this.form.get(c.label)?.enable();
                const children = this.parametros.filter(
                  (p) => p.conditionalRef && p.conditionalRef.label === c.label
                );
                children.map((c) => this.form.get(c.label)?.enable());
              } else {
                this.form.get(c.label)?.disable();
                const children = this.parametros.filter(
                  (p) => p.conditionalRef && p.conditionalRef.label === c.label
                );
                children.map((c) => this.form.get(c.label)?.disable());
              }
            });
          }
        }

        this._formValue = this.form.value;
      })

      // const formControl = this.form
      //   .get(label)
      //   ?.valueChanges.subscribe((parent) => {
      //     console.log(parent);

      //     // Object.keys(this.form.value).map((k) => {
      //     //   const children = this.parametros.filter(
      //     //     (p) => p.conditionalRef && p.conditionalRef.label === k
      //     //   );
      //     //   if (children.length > 0) {
      //     //     children.map((child) => {
      //     //       if (validateRule(parent, child))
      //     //         this.form.get(child.label)?.disable();
      //     //       else this.form.get(child.label)?.enable();
      //     //     });
      //     //   }
      //     // });
      //   });
    );
  }

  ngOnInit(): void {
    this.socket.emit('getAllParams');
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
    this.subscriptions.forEach((e) => e.unsubscribe());
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;

    Object.keys(this.form.value).map((x) => {
      const label = x;
      let value = this.form.value[x];
      if (typeof value === 'boolean') value = value ? 'TRUE' : 'FALSE';
      this.socket.emit('setParamValue', { label, value });
    });

    this.toastrSrv.success('Alteraçoes salvas com sucesso');

    this.loading = false;
    this.submitted = false;
    this.hasChange = false;
  }

  // --
}
