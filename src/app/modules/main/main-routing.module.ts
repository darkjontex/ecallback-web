import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RamalGuard } from './guards/ramal.guard';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [RamalGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'avisos',
        loadChildren: () =>
          import('./pages/aviso/aviso.module').then((m) => m.AvisoModule),
      },
      {
        path: 'callbacks',
        loadChildren: () =>
          import('./pages/callback/callback.module').then(
            (m) => m.CallbackModule
          ),
      },
      {
        path: 'incidencias',
        loadChildren: () =>
          import('./pages/incidencia/incidencia.module').then(
            (m) => m.IncidenciaModule
          ),
      },
      {
        path: 'parametros',
        loadChildren: () =>
          import('./pages/parametros/parametros.module').then(
            (m) => m.ParametrosModule
          ),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./pages/usuario/usuario.module').then(
            (m) => m.UsuarioModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
