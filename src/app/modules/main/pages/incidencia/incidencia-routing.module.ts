import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbService } from 'ng-breadcrumb';
import { IncidenciaComponent } from './incidencia.component';
import { ListarComponent } from './pages/listar/listar.component';
import { VisualizarComponent } from './pages/visualizar/visualizar.component';

const routes: Routes = [
  {
    path: '',
    component: IncidenciaComponent,
    children: [
      { path: '', component: ListarComponent },
      { path: ':id', component: VisualizarComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidenciaRoutingModule {
  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.addFriendlyNameForRoute('/incidencias', 'Incidencias');
  }
}
