import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RoleProfileComponent } from './role-profile/role-profile.component';
import { D3ChartsModule } from '../d3-charts/d3-charts.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SearchFilterModule } from 'src/app/shared/search-filter/search-filter.module';
import { FooterModule } from 'src/app/core/footer/footer/footer.module';

@NgModule({
  declarations: [RolesComponent, RoleProfileComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    MatSliderModule,
    MatCardModule,
    MatOptionModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    FormsModule,
    MatButtonToggleModule,
    D3ChartsModule,
    MatPaginatorModule,
    ClipboardModule,
    SearchFilterModule,
    FooterModule,
  ],
})
export class RolesModule {}
