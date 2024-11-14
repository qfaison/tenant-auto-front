import { Component, Input } from '@angular/core';
import { API_CONSTANT } from 'src/app/core/constant/api.constant';
import { MESSAGE_CONSTANT } from 'src/app/core/constant/message.constant';
import { ApiService } from 'src/app/core/services/api.services';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-bankelo-info-modal',
  templateUrl: './bankelo-info-modal.component.html',
  styleUrls: ['./bankelo-info-modal.component.scss'],
})
export class BankeloInfoModalComponent {
  isSubmittable: boolean = true;
  @Input() selectedTenant: any = {
    bankelo: {
      legalName: 'Bankelo Ltd',
      externalId: '12345',
      registrationNumber: 'RN9876',
      side: 'Left',
      organizationType: 'Private',
      industry: 'Finance',
      countryOfOperation: 'Kenya',
      countryOfRegistration: 'Kenya',
      countryOfOwnership: 'Kenya',
      dateOfIncorporation: '01-Jan-2000',
      shareholders: 'John Doe, Jane Smith',
      parentOrganization: 'Bankelo Holdings',
      primaryBusinessActivity: 'Banking',
      additionalInformation: 'N/A',
      documents: [
        {
          label: 'Document 1',
          identifier: 'PDF',
          url: 'https://example.com/doc1.pdf',
        },
        {
          label: 'Document 2',
          identifier: 'Word',
          url: 'https://example.com/doc2.docx',
        },
      ],
    },
  };

  constructor(
    private _toastService: ToastService,
    private _apiService: ApiService
  ) {}

  onCloseModal() {}

  onSubmitForApproval() {}

  onOpenConfirmationModal() {}

  onDownloadDocument(url: string) {
    const a = document.createElement('a');
    a.href = `${environment.BASE_URL}/${url}`;
    a.target = '__blank';
    a.click();
  }

  onSubmitDocumentForApproval(documentType: string) {
    this._apiService
      .post(
        `${API_CONSTANT.BANKELO.ONBOARDING_DOCUMENT}/${this.selectedTenant?.tenantId}/${documentType}`,
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
}
