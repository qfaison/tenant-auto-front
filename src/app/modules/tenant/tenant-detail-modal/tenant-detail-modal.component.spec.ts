import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantDetailModalComponent } from './tenant-detail-modal.component';

describe('TenantDetailModalComponent', () => {
  let component: TenantDetailModalComponent;
  let fixture: ComponentFixture<TenantDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantDetailModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
