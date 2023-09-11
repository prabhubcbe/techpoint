import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent {
  constructor(public router: Router) {}

  compareBtn() {
    this.router.navigate(['/reports/analysis/comparsion']);
  }
  routeBaselinecomp() {
    this.router.navigate(['/reports/analysis/baseline']);
  }
}
