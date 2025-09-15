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
    this.editedEmail = this.selectedTenant.email || ''
    this.modalController.open(modal, {
      size: 'md',
    });
  }
}
