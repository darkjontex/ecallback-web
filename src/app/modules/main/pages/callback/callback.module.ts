import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../../common/common.module';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CallbackRoutingModule } from './callback-routing.module';
import { CallbackComponent } from './callback.component';
import { CallbackFormComponent } from './components/callback/callback.component';
import { CallbacksTableComponent } from './components/callbacks-table/callbacks-table.component';
import { FiltroComponent } from './components/filtro/filtro.component';
import { ListarComponent } from './pages/listar/listar.component';
import { VisualizarComponent } from './pages/visualizar/visualizar.component';
import { CallbackSocket } from './providers/incidencia.socket';

@NgModule({
  declarations: [
    CallbackComponent,
    ListarComponent,
    VisualizarComponent,
    FiltroComponent,
    CallbacksTableComponent,
    CallbackFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDatepickerModule,
    CallbackRoutingModule,
  ],
  exports: [CallbacksTableComponent],
  providers: [CallbackSocket],
})
export class CallbackModule {}
