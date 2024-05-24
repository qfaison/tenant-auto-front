import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankeloComponent } from './bankelo.component';

describe('BankeloComponent', () => {
  let component: BankeloComponent;
  let fixture: ComponentFixture<BankeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
