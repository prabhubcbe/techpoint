import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TeamsProfileComponent } from './teams-profile/teams-profile.component';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { TeamprofileemployeesComponent } from './teamprofileemployees/teamprofileemployees.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatPaginatorModule } from '@angular/material/paginator';
import { D3ChartsModule } from '../../d3-charts/d3-charts.module';

@NgModule({
  declarations: [
    TeamsComponent,
    TeamsProfileComponent,
    TeamprofileemployeesComponent,
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatCardModule,
    MatCheckboxModule,
    MatTabsModule,
    CarouselModule,MatPaginatorModule,
    D3ChartsModule
  ],
})
export class TeamsModule {}
