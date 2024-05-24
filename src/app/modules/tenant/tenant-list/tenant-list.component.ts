import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { API_CONSTANT } from 'src/app/core/constant/api.constant';
import { APP_CONSTANT } from 'src/app/core/constant/app.constant';
import { ApiService } from 'src/app/core/services/api.services';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss'],
})
export class TenantListComponent {
  logoUrl = 'assets/vercado_small.png';
  searchText: FormControl = new FormControl('', Validators.required);
  pagination: any = {
    page: 1,
    limit: 10,
    totalSize: 0,
  };
  rows: Array<number> = [10, 20, 50, 100];
  tenants: Array<any> = [];
  limit: number = APP_CONSTANT.LIMIT;
  searchTextValue: string = '';
  isOnboarding: boolean = false;

  constructor(private _apiService: ApiService, private _router: Router) {
    this.onFetchTenants();
    this.searchText.valueChanges
      .pipe(debounceTime(1200))
      .subscribe((searchText) => {
        this.pagination.page = 1;
        this.searchTextValue = searchText;
        this.onFetchTenants();
      });
  }

  onFetchTenants() {
    const preparedQuery: any = {
      skip: this.handleSkip(),
      limit: this.limit,
    };
    if (this.searchTextValue) {
      preparedQuery.searchText = this.searchTextValue;
    }
    if (this.isOnboarding) {
      preparedQuery.isOnboarding = this.isOnboarding;
    }
    this._apiService
      .get(API_CONSTANT.TENANT.FETCH_WITH_PAGINATION, { query: preparedQuery })
      .subscribe((res: any) => {
        this.tenants = res?.body?.data || [];
        this.pagination.totalSize = res?.body?.totalCounts || 0;
      });
  }

  onPageChange(rowValue: number) {
    this.pagination.page = rowValue;
    this.onFetchTenants();
  }

  onChangeNoOfRows($event: any) {
    this.pagination.page = 1;
    this.limit = $event.target.value;
    this.onFetchTenants();
  }

  handleSkip() {
    if (this.pagination.page == 1) {
      return 0;
    } else {
      return (this.pagination.page - 1) * 10;
    }
  }

  onNavigateToTenantDetail(tenant: any) {
    this._router.navigate(['tenant/detail'], {
      queryParams: { tenant: JSON.stringify(tenant) },
    });
  }

  onCheckCheckBox($event: any) {
    this.isOnboarding = $event?.target?.checked;
    this.pagination.page = 1;
    this.onFetchTenants();
  }
}
