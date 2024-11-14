import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-tenant-detail-modal',
  templateUrl: './tenant-detail-modal.component.html',
  styleUrls: ['./tenant-detail-modal.component.scss'],
})
export class TenantDetailModalComponent {
  @Input() selectedTenant: any;


  onCloseModal() {

  }
}
