import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamsComponent } from './teams.component';
import { TeamsProfileComponent } from './teams-profile/teams-profile.component';

const routes: Routes = [
  { path: '', component: TeamsComponent },
  { path: 'teamsprofile', component: TeamsProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
