import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { E404Component } from './pages/e404/e404.component';
import { E400Component } from './pages/e400/e400.component';
import { E500Component } from './pages/e500/e500.component';


@NgModule({
  declarations: [
    ErrorComponent,
    E404Component,
    E400Component,
    E500Component
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }
