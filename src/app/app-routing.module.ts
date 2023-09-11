import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';

import { LayoutComponent } from './components/layout/layout.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotpasswordComponent } from './components/auth/forgotpassword/forgotpassword.component';
import { authGuardGuard } from './shared/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      // { path: '', component: HeaderComponent },
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () =>
          import('./components/home/home.module').then((m) => m.HomeModule),
        canActivate: [authGuardGuard],
      },
      {
        path: 'candidates',
        loadChildren: () =>
          import('./components/candidates/candidates/candidates.module').then(
            (m) => m.CandidatesModule
          ),
        canActivate: [authGuardGuard],
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('./components/employees/employees/employees.module').then(
            (m) => m.EmployeesModule
          ),
        canActivate: [authGuardGuard],
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./components/reports/reports/reports.module').then(
            (m) => m.ReportsModule
          ),
        canActivate: [authGuardGuard],
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./components/roles/roles.module').then((m) => m.RolesModule),
        canActivate: [authGuardGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
