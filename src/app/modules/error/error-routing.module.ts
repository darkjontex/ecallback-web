import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error.component';
import { E400Component } from './pages/e400/e400.component';
import { E404Component } from './pages/e404/e404.component';
import { E500Component } from './pages/e500/e500.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'e400',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ErrorComponent,
    children: [
      { path: 'e400', component: E400Component },
      { path: 'e404', component: E404Component },
      { path: 'e500', component: E500Component },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
