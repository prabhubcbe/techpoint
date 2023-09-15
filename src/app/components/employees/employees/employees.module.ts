import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxGaugeModule } from 'ngx-gauge';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeprofileComponent } from '../employeeprofile/employeeprofile.component';
import { IndividualComponent } from '../individual/individual.component';

import { D3ChartsModule } from '../../d3-charts/d3-charts.module';
import { SearchFilterModule } from "../../../shared/search-filter/search-filter.module";

@NgModule({
    declarations: [
        EmployeesComponent,
        EmployeeprofileComponent,
        IndividualComponent,
    ],
    imports: [
        CommonModule,
        EmployeesRoutingModule,
        HttpClientModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatChipsModule,
        ReactiveFormsModule,
        MatIconModule,
        NgxMatSelectSearchModule,
        MatDividerModule,
        MatPaginatorModule,
        MatCardModule,
        MatCheckboxModule,
        NgbRatingModule,
        MatTabsModule,
        NgxGaugeModule,
        MatCardModule,
        D3ChartsModule,
        SearchFilterModule
    ]
})
export class EmployeesModule {}
