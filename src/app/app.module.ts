import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from '../app/core/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SuccessdialogComponent } from './shared/successdialog/successdialog.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ForgotpasswordComponent } from './components/auth/forgotpassword/forgotpassword.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthorizationInterceptor } from './server/authorization-interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { SearchFilterModule } from './shared/search-filter/search-filter.module';
import { FooterModule } from './core/footer/footer/footer.module';
import { SpinnerModuleModule } from './shared/spinner-module/spinner-module.module';
// import { SpinnerComponent } from './shared/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SuccessdialogComponent,
    SignupComponent,
    LoginComponent,
    LayoutComponent,
    ForgotpasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatTabsModule,
    MatPaginatorModule,
    MatStepperModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    SearchFilterModule,
    FooterModule,

    NgxSpinnerModule.forRoot({ type: 'ball-atom' }),
    SpinnerModuleModule,
  ],
  exports: [NgxSpinnerModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
