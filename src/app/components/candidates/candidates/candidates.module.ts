import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesRoutingModule } from './candidates-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidatesComponent } from './candidates.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ApplicantsComponent } from '../applicants/applicants/applicants.component';
import { CandidatesprofileComponent } from '../candidatesprofile/candidatesprofile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxGaugeModule } from 'ngx-gauge';
import { MatDialogModule } from '@angular/material/dialog';
import { D3ChartsModule } from '../../d3-charts/d3-charts.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchFilterModule } from 'src/app/shared/search-filter/search-filter.module';
import { FooterModule } from 'src/app/core/footer/footer/footer.module';
@NgModule({
  declarations: [
    CandidatesComponent,
    ApplicantsComponent,
    CandidatesprofileComponent,
  ],
  imports: [
    CommonModule,
    CandidatesRoutingModule,
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
    MatDialogModule,
    D3ChartsModule,
    MatAutocompleteModule,
    SearchFilterModule,
    FooterModule,
  ],
})
export class CandidatesModule {}
