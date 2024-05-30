import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Injectable()
export class HttpInterceptorHandler implements HttpInterceptor {
  constructor(
    private _toastService: ToastService,
    private _storageService: StorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers = request.headers;
    if (request.url.includes('bonanzaconnect.com')) {
      headers = headers.append('Authorization', 'bearer test123');
    } else {
      headers = headers.append(
        'Authorization',
        this._storageService.getToken()
      );
    }
    const reqClone = request.clone({
      headers,
    });
    return next.handle(reqClone).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            /* You can show success message here */
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.statusText === 'Unknown Error') {
            this._toastService.showError(
              'You are not connected to the internet, Or maybe the server is down.'
            );
          } else {
            if (typeof error?.error?.message === 'object') {
              error.error.message.forEach((error: any) => {
                this._toastService.showError(error?.message);
              });
            } else {
              this._toastService.showError(
                error?.error?.message ||
                  error?.error?.response?.message ||
                  error?.message
              );
            }
          }
        },
      })
    );
  }
}
