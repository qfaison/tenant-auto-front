import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { API_CONSTANT } from 'src/app/core/constant/api.constant';
import { APP_CONSTANT } from 'src/app/core/constant/app.constant';
import { ApiService } from 'src/app/core/services/api.services';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  loginForm!: FormGroup;
  logoUrl: string = 'assets/vercado.png';

  constructor(
    private _apiService: ApiService,
    private _formBuilder: FormBuilder,
    private _storageService: StorageService,
    private _router: Router
  ) {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    this._apiService
      .post(API_CONSTANT.USER.LOGIN, { body: this.loginForm.value })
      .subscribe((res: any) => {
        this._storageService.setToken(res.body);
        this._router.navigate(['tenant/list']);
      });
  }
}
