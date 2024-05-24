import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgSelectModule } from "@ng-select/ng-select";
import { TenantComponent } from "./tenant.component";
import { TenantRoutingModule } from "./tenant.routing.module";
import { TenantListComponent } from "./tenant-list/tenant-list.component";
import { TenantDetailComponent } from "./tenant-detail/tenant-detail.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [TenantComponent, TenantListComponent, TenantDetailComponent],
  providers: [],
  imports: [
    TenantRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule
  ],
  exports: []
})
export class TenantModule { }