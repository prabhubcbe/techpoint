import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { AnalysisComponent } from '../../reports/analysis/analysis.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { ComparsionComponent } from '../../reports/comparsion/comparsion.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { BaselineComponent } from '../baseline/baseline.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PreGeneratereportComponent } from '../pre-generatereport/pre-generatereport.component';
import { CustomreportComponent } from '../customreport/customreport.component';
import { PromptAIComponent } from '../prompt-ai/prompt-ai.component';
import { D3ChartsModule } from "../../d3-charts/d3-charts.module";

@NgModule({
    declarations: [
        ReportsComponent,
        AnalysisComponent,
        ComparsionComponent,
        BaselineComponent,
        PreGeneratereportComponent,
        CustomreportComponent,
        PromptAIComponent,
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDividerModule,
        NgxGaugeModule,
        MatTabsModule,
        MatCheckboxModule,
        MatSliderModule,
        MatPaginatorModule,
        DragDropModule,
        MatChipsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        D3ChartsModule
    ]
})
export class ReportsModule {}
