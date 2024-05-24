import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { BankeloComponent } from "./bankelo.component";
import { BankeloRoutingModule } from "./bankelo.routing.module";
@NgModule({
  declarations: [BankeloComponent],
  providers: [],
  imports: [
    BankeloRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule
  ],
  exports: []
})
export class BankeloModule { }