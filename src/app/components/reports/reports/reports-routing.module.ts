import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { AnalysisComponent } from '../analysis/analysis.component';
import { ComparsionComponent } from '../comparsion/comparsion.component';
import { BaselineComponent } from '../baseline/baseline.component';
import { PreGeneratereportComponent } from '../pre-generatereport/pre-generatereport.component';
import { CustomreportComponent } from '../customreport/customreport.component';
import { PromptAIComponent } from '../prompt-ai/prompt-ai.component';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'pre-generate-report', component: PreGeneratereportComponent },
  { path: 'analysis/comparsion', component: ComparsionComponent },
  { path: 'analysis/baseline', component: BaselineComponent },
  { path: 'customreport', component: CustomreportComponent },
  { path: 'mayamayaAi', component: PromptAIComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
