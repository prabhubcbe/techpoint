import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesprofileComponent } from './candidatesprofile.component';

describe('CandidatesprofileComponent', () => {
  let component: CandidatesprofileComponent;
  let fixture: ComponentFixture<CandidatesprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatesprofileComponent]
    });
    fixture = TestBed.createComponent(CandidatesprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
