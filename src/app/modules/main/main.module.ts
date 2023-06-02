import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBreadcrumbModule } from 'ng-breadcrumb';
import { NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '../common/common.module';
import { COMPONENTS } from './components';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MainSocket } from './main.socket';

@NgModule({
  declarations: [MainComponent, ...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainRoutingModule,
    NgBreadcrumbModule,
    NgxMaskModule.forChild(),
  ],
  providers: [MainSocket]
})
export class MainModule {}
