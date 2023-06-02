import { NgModule } from '@angular/core';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '../../../common/common.module';
import { UsuarioSocket } from './providers/usuario.socket';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario.component';


@NgModule({
  declarations: [
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [UsuarioSocket]
})
export class UsuarioModule { }
