import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGeneratereportComponent } from './pre-generatereport.component';

describe('PreGeneratereportComponent', () => {
  let component: PreGeneratereportComponent;
  let fixture: ComponentFixture<PreGeneratereportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreGeneratereportComponent]
    });
    fixture = TestBed.createComponent(PreGeneratereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
