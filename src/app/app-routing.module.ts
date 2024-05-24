import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
     canActivate: [AuthGuard],
  },
  {
    path: 'tenant',
    loadChildren: () =>
      import('./modules/tenant/tenant.module').then((m) => m.TenantModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'bankelo/:tenantId/:token',
    loadChildren: () =>
      import('./modules/bankelo/bankelo.module').then((m) => m.BankeloModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true , preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
