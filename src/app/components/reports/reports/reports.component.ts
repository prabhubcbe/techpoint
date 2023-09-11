import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  constructor(private router: Router) {}
  routeAnalysis() {
    console.log('routeAnalysis');
    this.router.navigate(['reports/analysis']);
  }

  preGenerarteReport() {
    this.router.navigate(['reports/pre-generate-report']);
  }

  customReport() {
    this.router.navigate(['/reports/customreport']);
  }

  mayamayaAI() {
    this.router.navigate(['/reports/mayamayaAi']);
  }
}
