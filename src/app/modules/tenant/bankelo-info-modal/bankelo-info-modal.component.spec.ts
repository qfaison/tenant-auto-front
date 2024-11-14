import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankeloInfoModalComponent } from './bankelo-info-modal.component';

describe('BankeloInfoModalComponent', () => {
  let component: BankeloInfoModalComponent;
  let fixture: ComponentFixture<BankeloInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankeloInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankeloInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
