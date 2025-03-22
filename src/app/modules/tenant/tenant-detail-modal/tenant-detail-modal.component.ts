import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Input() webhookBaseUrl: string = '';

  isEditing: boolean = false;

  @Output() onUpdateWebhook: EventEmitter<string> = new EventEmitter<string>();

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
    console.log(this.webhookBaseUrl)
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.onUpdateWebhook.emit(this.webhookBaseUrl);
    }
  }
}
