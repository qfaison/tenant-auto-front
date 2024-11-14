import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { APP_CONSTANT } from '../constant/app.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _storageService: StorageService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (route.routeConfig?.path === APP_CONSTANT.ROUTES.USER.LOGIN) {
      /* Login routes this block executeds */
      if (this._storageService.getToken()) {
        this._router.navigate(['tenant/list'], {
          replaceUrl: true,
        });
        return false;
      }
      return true;
    } else {
      /* On other routes this block executed */
      if (this._storageService.getToken()) {
        return true;
      } else {
        this._router.navigate([APP_CONSTANT.ROUTES.USER.LOGIN], {
          replaceUrl: true,
        });
        return false;
      }
    }
  }
}
