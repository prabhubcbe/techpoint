import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';
import { D3ChartsModule } from 'src/app/components/d3-charts/d3-charts.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FooterModule } from 'src/app/core/footer/footer/footer.module';
import { SpinnerModuleModule } from 'src/app/shared/spinner-module/spinner-module.module';
// import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';

@NgModule({
  declarations: [HomeComponent],

  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatCardModule,
    MatDividerModule,
    NgbModule,
    SlickCarouselModule,
    CarouselModule,
    MatFormFieldModule,
    FormsModule,
    D3ChartsModule,
    MatCheckboxModule,
    FooterModule,
    SpinnerModuleModule,
  ],
})
export class HomeModule {}
