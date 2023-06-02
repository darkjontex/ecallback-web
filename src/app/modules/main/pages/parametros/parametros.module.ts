import { NgModule } from '@angular/core';
import { CommonModule } from '../../../common/common.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { ParametrosComponent } from './parametros.component';
import { ParametrosSocket } from './providers/parametros.socket';

@NgModule({
  declarations: [ParametrosComponent],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule.forRoot({
      // size: 'small',
      // color: 'rgb(255, 255, 255)',
      // switchColor: '#80FFA2',
      // defaultBgColor: '#00ACFF',
      // defaultBoColor : '#476EFF',
      checkedTextColor: 'rgb(255,255,255)',
      checkedLabel: 'Ativo',
      uncheckedLabel: 'Inativo',
    }),
    NgxMaskModule.forChild(),
  ],
  providers: [ParametrosSocket],
})
export class ParametrosModule {}
