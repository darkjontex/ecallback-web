import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '../../../common/common.module';
import { AvisoModule } from '../aviso/aviso.module';
import { CallbackModule } from '../callback/callback.module';
import { COMPONENTS } from './components';
import { IncidenciaRoutingModule } from './incidencia-routing.module';
import { IncidenciaComponent } from './incidencia.component';
import { PAGES } from './pages';
import { IncidenciaSocket } from './providers/incidencia.socket';

@NgModule({
  declarations: [ ...COMPONENTS, ...PAGES, IncidenciaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDatepickerModule,
    NgxMaskModule.forChild(),
    NgMultiSelectDropDownModule,
    HttpClientModule,
    // --
    IncidenciaRoutingModule,
    // --
    AvisoModule,
    CallbackModule,
  ],
  providers: [IncidenciaSocket],
})
export class IncidenciaModule {}
