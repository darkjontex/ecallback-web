import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbService } from 'ng-breadcrumb';
import { AvisoComponent } from './aviso.component';
import { ListarComponent } from './pages/listar/listar.component';
import { VisualizarComponent } from './pages/visualizar/visualizar.component';

const routes: Routes = [
  {
    path: '',
    component: AvisoComponent,
    children: [
      {
        path: '',
        component: ListarComponent,
      },
      {
        path: ':numero',
        component: VisualizarComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvisoRoutingModule {
  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.addFriendlyNameForRoute('/avisos', 'Avisos');
  }
}
