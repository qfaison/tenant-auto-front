import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { API_CONSTANT } from 'src/app/core/constant/api.constant';
import { MESSAGE_CONSTANT } from 'src/app/core/constant/message.constant';
import { ApiService } from 'src/app/core/services/api.services';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-tenant-info',
  templateUrl: './tenant-info.component.html',
  styleUrls: ['./tenant-info.component.scss'],
})
export class TenantInfoComponent {
  tenant: any;
  tenantUpdateForm!: FormGroup;
  sslCertificate: any;
  privateKey: any;
  bundle: any;
  selectedDomain: string = '';
  appleVerFile: FormControl = new FormControl('', Validators.required);
  tenantCreateForm!: FormGroup;
  domains: Array<string> = ['vercado.com', 'enterprisehub.io'];

  constructor(
    private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _toastService: ToastService,
    private _modalService: NgbModal
  ) {
    this.tenant = history.state.data;
    this.buildUpdateTenantForm();
    this.tenantUpdateForm.patchValue({
      tenantId: this.tenant?.tenantId,
      customDomain: this.tenant?.customDomain || '',
    });
  }

  buildUpdateTenantForm() {
    this.tenantUpdateForm = this._formBuilder.group({
      tenantId: ['', Validators.required],
      customDomain: ['', Validators.required],
      sslCertificate: ['', Validators.required],
      privateKey: ['', Validators.required],
      bundle: [''],
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

  onSubmitForApproval() {}

  onOpenConfirmationModal(modalName: string, modalTemplate: any) {
    switch (modalName) {
      case 'BANKELO_APPROVAL':
        this._modalService.open(modalTemplate, {
          centered: true,
        });
        break;
      case 'PUBLIC':
        this._modalService.open(modalTemplate, {
          centered: true,
        });
        break;
      case 'PRIVATE':
        this._modalService.open(modalTemplate, {
          centered: true,
        });
        break;
      case 'STOP':
        this._modalService.open(modalTemplate, {
          centered: true,
        });
        break;
      case 'RESTART':
        this._modalService.open(modalTemplate, {
          centered: true,
        });
        break;
    }
  }

  onMakePublic() {
    this._apiService
      .post(API_CONSTANT.TENANT.REMOVE_CONSTRAINTS, {
        body: {
          tenantId: this.tenant.tenantId,
        },
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

  onMakePrivate() {
    this._apiService
      .post(API_CONSTANT.TENANT.ADD_CONSTRAINTS, {
        body: {
          tenantId: this.tenant.tenantId,
        },
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
    this._apiService
      .post(API_CONSTANT.TENANT.STOP, {
        body: {
          tenantId: this.tenant.tenantId,
          apiKey: this.tenant.api
        },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.showSuccess(
            res.message || res.response?.message || MESSAGE_CONSTANT.TENANT.STOP
          );
        },
      });
  }

  onRestartTenant() {
    this._apiService
      .post(API_CONSTANT.TENANT.RESTART, {
        body: {
          tenantId: this.tenant.tenantId,
        },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.showSuccess(
            res.message || res.response?.message || MESSAGE_CONSTANT.TENANT.STOP
          );
        },
      });
  }

  onApplyForBuckzy() {
    this._apiService
      .post(`${API_CONSTANT.BANKELO.ONBOARDING}`, {
        body: { tenantId: this.tenant?.tenantId },
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

  onChangeAppldeVerFile(file: any) {
    this.appleVerFile.setValue(file.target.files[0]);
  }

  onUploadAppleVerFile() {
    const formData = new FormData();
    formData.append('appleVerificationFile', this.appleVerFile.value);
    this._apiService
      .post(`${API_CONSTANT.TENANT.APPLE_VERIFICATION_FILE_UPLOAD}`, {
        body: formData,
        header: { tenantId: this.tenant.tenantId },
      })
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this._toastService.showSuccess(res.message);
            this.appleVerFile.reset();
          }
        },
      });
  }

  onNavigateBack() {
    history.back()
  }
}
