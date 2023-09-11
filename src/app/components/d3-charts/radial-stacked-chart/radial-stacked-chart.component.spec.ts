import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialStackedChartComponent } from './radial-stacked-chart.component';

describe('RadialStackedChartComponent', () => {
  let component: RadialStackedChartComponent;
  let fixture: ComponentFixture<RadialStackedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadialStackedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadialStackedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
