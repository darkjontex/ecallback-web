import { NgModule } from '@angular/core';
import { CommonModule } from '../../../common/common.module';

import { NgxGaugeModule } from 'ngx-gauge';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AppSocket } from './providers/app.socket';
import { CallbackAutomaticoSocket } from './providers/callback-automatico.socket';
import { ComunicacaoProativaSocket } from './providers/comunicacao-proativa.socket';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxGaugeModule
  ],
  providers: [CallbackAutomaticoSocket, ComunicacaoProativaSocket, AppSocket]
})
export class DashboardModule { }
