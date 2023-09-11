import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { EmployeeprofileComponent } from '../employeeprofile/employeeprofile.component';
import { IndividualComponent } from '../individual/individual.component';

const routes: Routes = [
  { path: '', component: EmployeesComponent },
  { path: 'individual', component: IndividualComponent },
  { path: 'employeeprofile', component: EmployeeprofileComponent },
  {
    path: 'teams',
    loadChildren: () =>
      import('../teams/teams.module').then((m) => m.TeamsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
