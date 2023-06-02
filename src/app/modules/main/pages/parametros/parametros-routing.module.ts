import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbService } from 'ng-breadcrumb';
import { ParametrosComponent } from './parametros.component';
import { ParametrosGuard } from './parametros.guard';

const routes: Routes = [{ path: '', canActivate: [ParametrosGuard], component: ParametrosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule {
  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.addFriendlyNameForRoute('/parametros', 'Parâmetros');
  }
 }
