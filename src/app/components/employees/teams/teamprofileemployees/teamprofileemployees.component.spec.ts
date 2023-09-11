import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamprofileemployeesComponent } from './teamprofileemployees.component';

describe('TeamprofileemployeesComponent', () => {
  let component: TeamprofileemployeesComponent;
  let fixture: ComponentFixture<TeamprofileemployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamprofileemployeesComponent]
    });
    fixture = TestBed.createComponent(TeamprofileemployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
