import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public spinkit = Spinkit;
  isShowNavbar: boolean = false;
  constructor(private _router: Router) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('login') || event.url.includes('/bankelo/') || event.url === '/') {
          this.isShowNavbar = false;
        } else {
          this.isShowNavbar = true;
        }
      }
    });
  }
}
