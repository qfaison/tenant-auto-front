import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BankeloComponent } from "./bankelo.component";


const routes: Routes = [
  {
    path: '',
    component: BankeloComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankeloRoutingModule { }