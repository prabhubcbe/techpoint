import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { RoleProfileComponent } from './role-profile/role-profile.component';

const routes: Routes = [
  { path: '', component: RolesComponent },
  { path: 'RoleProfile', component: RoleProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
