import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '../../../common/common.module';
import { CallbackModule } from '../callback/callback.module';
import { AvisoRoutingModule } from './aviso-routing.module';
import { AvisoComponent } from './aviso.component';
import { AvisosComponent } from './components/avisos/avisos.component';
import { ListarComponent } from './pages/listar/listar.component';
import { VisualizarComponent } from './pages/visualizar/visualizar.component';
import { AvisoSocket } from './providers/aviso.socket';

@NgModule({
  declarations: [
    AvisoComponent,
    AvisosComponent,
    ListarComponent,
    VisualizarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AvisoRoutingModule,
    NgbModule,
    CallbackModule
  ],
  exports: [AvisosComponent],
  providers: [AvisoSocket],
})
export class AvisoModule {}
