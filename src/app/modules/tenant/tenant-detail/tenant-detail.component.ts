import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_CONSTANT } from 'src/app/core/constant/api.constant';
import { MESSAGE_CONSTANT } from 'src/app/core/constant/message.constant';
import { ApiService } from 'src/app/core/services/api.services';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.scss'],
})
export class TenantDetailComponent {
  searchResult: any = {};
  constructor(
    private _activateRoute: ActivatedRoute,
    private _apiService: ApiService,
    private _toastService: ToastService,
    private _router: Router
  ) {
    this._activateRoute.queryParams.subscribe((res: any) => {
      if (res?.tenant) {
        this.searchResult = JSON.parse(res.tenant);
      }
    });
  }

  onDownloadDocument(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '__blank';
    a.click();
  }

  onSubmitDocumentForApproval(documentType: string) {
    this._apiService
      .post(
        `${API_CONSTANT.BANKELO.ONBOARDING_DOCUMENT}/${this.searchResult?.tenantId}/${documentType}`,
        { body: {} }
      )
      .subscribe({
        next: (res: any) => {
          this._toastService.showSuccess(
            res?.messsage || MESSAGE_CONSTANT.BANKELO.ONBOARDING_DOCUMENT
          );
        },
      });
  }

  onNavigateBack() {
    this._router.navigate(['tenant/list'])
  }

  onApplyForBuckzy(userType: string) {
    this._apiService
      .post(`${API_CONSTANT.BANKELO.ONBOARDING}`, {
        body: { tenantId: this.searchResult?.tenantId },
      })
      .subscribe({
        next: (res: any) => {
          if (res?.status === 200) {
            this._toastService.showSuccess(
              res?.message || MESSAGE_CONSTANT.BANKELO.ONBOARDING
            );
          }
        },
      });
  }
}
