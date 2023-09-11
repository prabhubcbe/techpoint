import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomreportComponent } from './customreport.component';

describe('CustomreportComponent', () => {
  let component: CustomreportComponent;
  let fixture: ComponentFixture<CustomreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomreportComponent]
    });
    fixture = TestBed.createComponent(CustomreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
