import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ghl-info-modal',
  templateUrl: './ghl-info-modal.component.html',
  styleUrls: ['./ghl-info-modal.component.scss'],
})
export class GHLInfoModalComponent {
  @Input() selectedTenant: any;
  constructor() {}
}
