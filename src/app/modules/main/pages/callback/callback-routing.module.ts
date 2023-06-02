import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbService } from 'ng-breadcrumb';
import { CallbackComponent } from './callback.component';
import { ListarComponent } from './pages/listar/listar.component';
import { VisualizarComponent } from './pages/visualizar/visualizar.component';

const routes: Routes = [
  {
    path: '',
    component: CallbackComponent,
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
export class CallbackRoutingModule {
  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.addFriendlyNameForRoute('/callbacks', 'Callbacks');
  }
}
