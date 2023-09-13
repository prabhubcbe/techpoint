import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  env = environment;
  private editableSubject = new BehaviorSubject<string>('default_value');
  editable$ = this.editableSubject.asObservable();

  constructor(public http: HttpClient) {}

  // t =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXNobmFrYXJyaTExMUBnbWFpbC5jb20iLCJpYXQiOjE2OTIxODAzMjIsImV4cCI6MTY5MjI2NjcyMn0.-fsHO7Py6ZFON9XOZ7Pz6S2hYIriQUCb841IXRqR37E';

  // headers_object = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   Authorization: 'Bearer ' + this.t,
  // });

  // httpOptions = {
  //   headers: this.headers_object,
  // };

  setEditable(newValue: string) {
    this.editableSubject.next(newValue);
  }

  recentActivities(data: any) {
    return this.http.post(
      environment.url + environment.homePath + `/recent_activity`,
      data
    );
  }

  getTopEmployeesHome(data: any) {
    return this.http.post(
      environment.url + environment.employeePath + `/top_employees_with_aoi`,
      data
    );
  }

  getRecommendedCandidatesHome(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/get_maya_maya_recommends `,
      data
    );
  }
  getAllEmployeesData(data: any) {
    return this.http.post(
      environment.url + environment.employeePath + `/get_all_employees`,
      data
    );
  }

  getAllCnadidatesData(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_all_candidates`,
      data
    );
  }

  getEmployeeCategoriesData(data: any) {
    return this.http.post(
      environment.url + environment.managePath + `/get_emp_categories_data`,
      data
    );
  }

  // getCategoriesData(data: any) {
  //   return this.http.post(
  //     environment.url + environment.skillPath + `/get_categories_data`,
  //     data
  //   );
  // }

  // **********HARDSSKILLS BY USER ID************
  getHardskillsById(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/get_hard_skills_by_user_id`,
      data
    );
  }

  getCandidateOrgBubbleChartData(data: any) {
    return this.http.post(
      environment.url +
        environment.homePath +
        `/candidates_org_bubble_chart_data`,
      data
    );
  }

  getEmployeeOrgBubbleChartData(data: any) {
    return this.http.post(
      environment.url +
        environment.homePath +
        `/employees_org_bubble_chart_data`,
      data
    );
  }

  getEmployeesInTeamOrgBubbleChartData(data: any) {
    return this.http.post(
      environment.url +
        environment.homePath +
        `/employees_in_team_bubble_chart_data`,
      data
    );
  }

  recentRoles(data: any) {
    return this.http.post(
      environment.url + environment.homePath + `/get_top_five_roles`,
      data
    );
  }

  recentMessage(data: any) {
    return this.http.post(
      environment.url + environment.homePath + `/recent_messages`,
      data
    );
  }

  getOrgDetails(data: any) {
    return this.http.get(
      environment.url +
        environment.homePath +
        `/get_organizational_details?email=${data}`
    );
  }

  getEmployeesOrgCount(data: any) {
    return this.http.post(
      environment.url + environment.homePath + `/employees_in_org_count`,
      data
    );
  }

  getCandidatesOrgCount(data: any) {
    return this.http.post(
      environment.url + environment.homePath + `/candidates_in_org_count`,
      data
    );
  }

  getdepartmentOrgCount(data: any) {
    return this.http.post(
      environment.url +
        environment.homePath +
        `/employees_in_team_in_org_count`,
      data
    );
  }

  // ***********CANDIDATES APIS************
  allRoles(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_all_job_roles`,
      data
    );
  }

  // *********GET ROLE BY ID ***********
  rolesById(data: any) {
    return this.http.get(
      environment.url +
        environment.candidatePath +
        `/get_role_by_id?roleId=${data}`
    );
  }

  // ************GET USER BY ID ********************
  getUserById(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_user_details`,
      data
    );
  }

  // *******GET ALL SHORTLISTED CANDIDATES ************
  allShortlistedCandidates(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/get_all_shortlisted_candidates`,
      data
    );
  }

  // **********DELETE ROLE***************
  deleteRoleById(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/delete_role`,
      data
    );
  }

  getDepartmentsDropdown() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_department_values`
    );
  }

  getRecommendedJobs(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + '/get_recommended_jobs',
      data
    );
  }

  //  *********GET EMPLOYEES NAME DROP DOWN**********
  getEmployeesDropDown(data: any) {
    return this.http.post(
      environment.url + environment.employeePath + `/get_all_employees_names`,
      data
    );
  }

  // ****ROLE QUESTIONS ***********
  getRolesQuestions() {
    return this.http.get(
      environment.url +
        environment.candidatePath +
        `/get_role_creation_questions`
    );
  }

  // ************CREATE ROLE FROM EMPLOYEE************
  createRoleFromEmployee(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/create_role_from_employees`,
      data
    );
  }

  // ************CREATE ROLE FROM SCRATCH************
  createRoleFromScratch(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/create_role_from_scratch`,
      data
    );
  }

  getProfileIntelligence(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_profile_intelligence`,
      data
    );
  }

  getAction(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_action`,
      data
    );
  }

  // **********GET MATCHED RESULTS FOR ROLE************
  getMatchedResultsForRole(data: any) {
    return this.http.get(
      environment.url +
        environment.candidatePath +
        `/get_candidates_by_role?roleId=${data.roleId}&orgCode=${data.orgCode}&email=${data.email}&pageNo=${data.pageNo}&pageSize=${data.pageSize}`
    );
  }

  // *************GENERATE JOB DESCRIPTION************
  generateJobCreateDescription(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/ai_job_description_fetcher`,
      data
    );
  }

  // **************DUPLICATE ROLE***************
  createduplicateRole(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/duplicate_role`,
      data
    );
  }

  //*************APPLICANTS*****************
  getStatusLevelDropDown() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_stage_values`
    );
  }

  getAllRoles(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_all_job_roles`,
      data
    );
  }

  getRolesbyDepartment(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/role_values_by_department`,
      data
    );
  }

  // ***********SEARCH FILTER************
  searchFilterCandidates(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/apply_filter`,
      data
    );
  }

  // *************UPDATE JOB DESCRIPTION************
  updateJobDescription(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/update_job_description`,
      data
    );
  }

  // **********GET JOB DESCRIPTION***********
  getJobDescription(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_job_requirements`,
      data
    );
  }

  updatesSlider(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/update_role_by_id`,
      data
    );
  }

  // ********GET ETHNICITY DROP DOWN **********
  getEthnicityDropDown() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_ethnicity_values`
    );
  }

  // *********GENDER DROP DOWN **********
  getGenderDropDown() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_gender_values`
    );
  }

  getConsidirationsDropDown() {
    return this.http.get(
      environment.url +
        environment.candidatePath +
        `/get_special_consideration_values`
    );
  }

  getRegionDropDown() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_region_values`
    );
  }

  getHardSkillsDropDown() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_tools`
    );
  }

  filterByRoleId(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/filter_candidates_by_role`,
      data
    );
  }

  //**********MAKE CANDIDATE FAV TO ROLE */

  favCandidateToRole(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/shortlist_user_for_role`,
      data
    );
  }

  unFavCandidateToRole(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/un_shortlist_user_for_role`,
      data
    );
  }

  // **********GET NOTES FOR USER************
  getNotesForUser(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_notes`,
      data
    );
  }

  addNotes(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/add_notes`,
      data
    );
  }

  getMessages(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/get_messages`,
      data
    );
  }

  sendMessages(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/send_message`,
      data
    );
  }

  // ***********get shortlisted candiates in role profile************
  shortListedCandidatesInRole(data: any) {
    return this.http.post(
      environment.url +
        environment.candidatePath +
        `/get_shortlisted_candidates_for_role`,
      data
    );
  }

  getStageLevelDropDown() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_stage_values`
    );
  }
  setStageLevel(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/assign_stage_level`,
      data
    );
  }

  // ************get resources in action************
  getResourcesInAction() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_action_resource_types`
    );
  }

  saveAction(data: any) {
    return this.http.post(
      environment.url + environment.candidatePath + `/add_action`,
      data
    );
  }

  getLevel() {
    return this.http.get(
      environment.url + environment.candidatePath + `/get_levels`
    );
  }

  
}
