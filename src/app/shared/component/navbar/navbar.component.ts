import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { APP_CONSTANT } from 'src/app/core/constant/app.constant';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  logoUrl = 'assets/vercado_small.png';
  isBonanzaConnect: boolean = false;
  isTenantTab: boolean = true;
  isGHL: boolean = false;

  constructor(private _router: Router) {
    this.setActiveTab(this._router.url);
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTab(event.url);
      }
    });
  }

  onLogout() {
    localStorage.clear();
    this._router.navigate([APP_CONSTANT.ROUTES.USER.LOGIN], {
      replaceUrl: true,
    });
  }

  setActiveTab(identifier: string) {
    if (identifier.includes('bonanza-connect')) {
      this.isBonanzaConnect = true;
      this.isGHL = false;
      this.isTenantTab = false;
    }
    if (identifier.includes('tenant/list')) {
      this.isTenantTab = true;
      this.isGHL = false;
      this.isBonanzaConnect = false;
    }
    if (identifier.includes('ghl')) {
      this.isGHL = true;
      this.isTenantTab = false;
      this.isBonanzaConnect = false;
    }
  }
}
