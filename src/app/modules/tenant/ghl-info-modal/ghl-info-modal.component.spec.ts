import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GHLInfoModalComponent } from './ghl-info-modal.component';

describe('GHLInfoModalComponent', () => {
  let component: GHLInfoModalComponent;
  let fixture: ComponentFixture<GHLInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GHLInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GHLInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
