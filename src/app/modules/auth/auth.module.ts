import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";

@NgModule({
  declarations: [AuthComponent],
  imports: [
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }