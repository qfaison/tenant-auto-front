import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { TenantComponent } from './tenant.component';
import { TenantRoutingModule } from './tenant.routing.module';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantDetailComponent } from './tenant-detail/tenant-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TenantDetailModalComponent } from './tenant-detail-modal/tenant-detail-modal.component';
import { BankeloInfoModalComponent } from './bankelo-info-modal/bankelo-info-modal.component';
import { GHLInfoModalComponent } from './ghl-info-modal/ghl-info-modal.component';
import { TenantInfoComponent } from './tenant-info/tenant-info.component';

@NgModule({
  declarations: [
    TenantComponent,
    TenantListComponent,
    TenantDetailComponent,
    TenantDetailModalComponent,
    BankeloInfoModalComponent,
    GHLInfoModalComponent,
    TenantInfoComponent
  ],
  providers: [],
  imports: [
    TenantRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
  ],
  exports: [],
})
export class TenantModule {}
