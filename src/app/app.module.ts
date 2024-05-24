import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastComponent } from './shared/component/toast/toast.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpInterceptorHandler } from './core/interceptor/http.interceptorHandler';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { NavbarComponent } from './shared/component/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    NgSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorHandler,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
