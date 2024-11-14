import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantComponent } from './tenant.component';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantDetailComponent } from './tenant-detail/tenant-detail.component';
import { TenantInfoComponent } from './tenant-info/tenant-info.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'setup',
    pathMatch: 'full',
  },
  {
    path: 'setup/:action',
    component: TenantComponent,
  },
  {
    path: 'list',
    component: TenantListComponent,
  },
  {
    path: 'detail',
    component: TenantDetailComponent,
  },
  {
    path: 'detail/:tenantId',
    component: TenantInfoComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantRoutingModule {}
