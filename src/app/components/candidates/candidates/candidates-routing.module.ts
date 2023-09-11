import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatesComponent } from './candidates.component';
import { ApplicantsComponent } from '../applicants/applicants/applicants.component';
import { CandidatesprofileComponent } from '../candidatesprofile/candidatesprofile.component';

const routes: Routes = [
  { path: '', component: CandidatesComponent },
  { path: 'applicants', component: ApplicantsComponent },
  { path: 'Candidatesprofile', component: CandidatesprofileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatesRoutingModule {}
