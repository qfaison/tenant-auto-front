import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tenant-detail-modal',
  templateUrl: './tenant-detail-modal.component.html',
  styleUrls: ['./tenant-detail-modal.component.scss'],
})
export class TenantDetailModalComponent {
  @Input() selectedTenant: any;
  @Output() onApproveCancelRequest: EventEmitter<void> =
    new EventEmitter<void>();

  @Output() onHandleWebbhook: EventEmitter<void> = new EventEmitter<void>();

  @Output() onHandleAccounts: EventEmitter<void> = new EventEmitter<void>();

  @Output() onUpdateEmail: EventEmitter<string> = new EventEmitter<string>();

  @Input() webhookBaseUrl: string = '';

  isEditing: boolean = false;

  @Output() onUpdateWebhook: EventEmitter<string> = new EventEmitter<string>();

  @Output() onSetupSSL: EventEmitter<string> = new EventEmitter<any>();

  editedEmail: string = '';

  constructor(private modalController: NgbModal) {}

  onCloseModal() {}

  approveCancelRequest() {
    this.onApproveCancelRequest.emit();
  }

  handleWebhook() {
    this.onHandleWebbhook.emit();
  }

  handleAccounts() {
    this.onHandleAccounts.emit();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.onUpdateWebhook.emit(this.webhookBaseUrl);
    }
  }

  updateEmail() {
    this.onUpdateEmail.emit(this.editedEmail);
  }

  openEmailUpdateModal(modal: any) {
    this.editedEmail = this.selectedTenant.email || '';
    this.modalController.open(modal, {
      size: 'md',
    });
  }

  setupSSL() {
    this.onSetupSSL.emit();
  }

  isSSLSetupDisabled(): boolean {
    const tenant = this.selectedTenant;

    // 1) No custom domain → Disable
    if (!tenant?.customDomain) return true;

    // 2) SSL expiry exists → Check days left
    if (tenant?.sslExpiryDate) {
      const daysLeft = this.getDaysLeft(tenant.sslExpiryDate);

      // Disable if more than 5 days left
      if (daysLeft > 5) return true;
    }

    return false;
  }

  getDaysLeft(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getSSLTooltip(): string {
    const tenant = this.selectedTenant;

    if (!tenant?.customDomain) {
      return 'Please setup a custom domain first';
    }

    if (tenant?.sslExpiryDate) {
      const daysLeft = this.getDaysLeft(tenant.sslExpiryDate);

      if (daysLeft > 5) {
        return `SSL valid. ${daysLeft} days left until renewal`;
      }

      return `SSL expires in ${daysLeft} days. Click to renew.`;
    }

    return 'Click to setup SSL';
  }
}
