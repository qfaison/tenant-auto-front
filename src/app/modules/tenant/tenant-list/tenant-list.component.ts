import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs';
import { API_CONSTANT } from 'src/app/core/constant/api.constant';
import { APP_CONSTANT } from 'src/app/core/constant/app.constant';
import { MESSAGE_CONSTANT } from 'src/app/core/constant/message.constant';
import { ApiService } from 'src/app/core/services/api.services';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TenantDetailModalComponent } from '../tenant-detail-modal/tenant-detail-modal.component';
import { BankeloInfoModalComponent } from '../bankelo-info-modal/bankelo-info-modal.component';
import { GHLInfoModalComponent } from '../ghl-info-modal/ghl-info-modal.component';

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
  tenantUpdateForm!: FormGroup;
  sslCertificate: any;
  privateKey: any;
  bundle: any;
  selectedDomain: string = '';
  @ViewChild('updateTenantModal') updateTenantModal!: ElementRef;
  appleDevFile: FormControl = new FormControl('', Validators.required);
  tenantCreateForm!: FormGroup;
  domains: Array<string> = ['vercado.com', 'enterprisehub.io'];

  constructor(
    private _apiService: ApiService,
    private _router: Router,
    private _toastService: ToastService,
    private _fromBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.buildUpdateTenantForm();
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

  onExportBankelo() {
    this._apiService
      .get(API_CONSTANT.TENANT.EXPORT_BANKO_EXCEL, {
        headers: {
          responseType: 'arrayBuffer' as 'text',
        },
      })
      .subscribe({
        next: (_res: any) => {
          let file = new Blob([_res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          var fileURL = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = `bankelo-tenant-${new Date().getDate()}-${
            new Date().getMonth() + 1
          }-${new Date().getFullYear()}.xlsx`;
          a.click();
        },
      });
  }

  onUpdateTenant() {
    if (this.tenantUpdateForm.invalid) {
      this.tenantUpdateForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    const updateFormValue = this.tenantUpdateForm.value;
    // console.log(this.tenantUpdateForm.value);
    for (let key in updateFormValue) {
      if (this.sslCertificate && key === 'sslCertificate') {
        formData.append(key, this.sslCertificate);
      } else if (this.privateKey && key === 'privateKey') {
        formData.append(key, this.privateKey);
      } else if (this.bundle && key === 'bundle') {
        formData.append(key, this.bundle);
      } else {
        if (updateFormValue[key]) {
          formData.append(key, updateFormValue[key]);
        }
      }
    }
    this._apiService
      .put(API_CONSTANT.TENANT.UPDATE, { body: formData })
      .subscribe({
        next: (res: any) => {
          this.tenantUpdateForm.reset();
          this.sslCertificate = '';
          this.bundle = '';
          this.privateKey = '';
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.UPDATE
          );
        },
      });
  }

  onFileChangeKey(file: any) {
    this.privateKey = file.target.files[0];
  }

  onFileChangeSsl(file: any) {
    this.sslCertificate = file.target.files[0];
  }

  onFileChangeBundle(file: any) {
    this.bundle = file.target.files[0];
  }

  buildUpdateTenantForm() {
    this.tenantUpdateForm = this._fromBuilder.group({
      tenantId: ['', Validators.required],
      customDomain: ['', Validators.required],
      sslCertificate: ['', Validators.required],
      privateKey: ['', Validators.required],
      bundle: [''],
    });
  }

  openUpdateTenantModal(tenant: any, modalContent: any) {
    // Set the form values with the selected tenant's data
    this.tenantUpdateForm.patchValue({
      tenantId: tenant?.tenantId,
      customDomain: tenant?.customDomain || '',
    });
    this.modalService.open(modalContent, { centered: true });
  }

  onMakePublic() {
    this._apiService
      .post(API_CONSTANT.TENANT.REMOVE_CONSTRAINTS, {
        body: 'test',
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.REMOVE_CONSTRAINTS
          );
        },
      });
  }

  onConfirmation(modalName: string, modalContent: any) {
    switch (modalName) {
      case 'PUBLIC':
        this.modalService.open(modalContent, {
          centered: true,
        });
        break;
      case 'PRIVATE':
        this.modalService.open(modalContent, {
          centered: true,
        });
        break;
      case 'STOP':
        this.modalService.open(modalContent, {
          centered: true,
        });
        break;
      case 'RESTART':
        this.modalService.open(modalContent, {
          centered: true,
        });
        break;
    }
  }

  onMakePrivate() {
    this._apiService
      .post(API_CONSTANT.TENANT.ADD_CONSTRAINTS, {
        body: 'teat',
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.ADD_CONSTRAINTS
          );
        },
      });
  }

  onStopTenant() {
    this._apiService.post(API_CONSTANT.TENANT.STOP, { body: '' }).subscribe({
      next: (res: any) => {
        this._toastService.showSuccess(
          res.message || res.response?.message || MESSAGE_CONSTANT.TENANT.STOP
        );
      },
    });
  }

  onRestartTenant() {
    this._apiService.post(API_CONSTANT.TENANT.RESTART, { body: '' }).subscribe({
      next: (res: any) => {
        this._toastService.showSuccess(
          res.message || res.response?.message || MESSAGE_CONSTANT.TENANT.STOP
        );
      },
    });
  }

  openUploadAppleDevFile(tenant: any, modalContent: any) {
    this.modalService.open(modalContent, { centered: true });
  }

  buildCreateTenantForm() {
    this.tenantCreateForm = this._fromBuilder.group({
      domainName: ['', Validators.required],
      tenantName: ['', Validators.required],
      customDomain: [''],
      apiKey: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
    });
  }

  onCreateTenant() {
    if(this.tenantCreateForm.invalid){
      this.tenantCreateForm.markAllAsTouched();
      return;
    }
    this._apiService
      .post(API_CONSTANT.TENANT.CREATE, { body: this.tenantCreateForm.value })
      .subscribe({
        next: (res: any) => {
          this.tenantCreateForm.reset();
          this.selectedDomain = 'vercado.com';
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.CREATE
          );
        },
      });
  }

  onOpenCreateTenantModal(modalContent: any) {
    this.buildCreateTenantForm();
    this.modalService.open(modalContent, { centered: true });
  }

  onOpenDetailModal(tenant: any) {
    const modalRef = this.modalService.open(TenantDetailModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.selectedTenant = tenant;;
  }

  onOpenBankeloInfoModal(tenant: any) {
    const modalRef = this.modalService.open(BankeloInfoModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.selectedTenant = tenant;
  }

  onOpenGHLInfoModal(tenant: any) {
    const modalRef = this.modalService.open(GHLInfoModalComponent, {
      centered: true,
      size: 'xl',
    });
    modalRef.componentInstance.selectedTenant = tenant;
  }
}
