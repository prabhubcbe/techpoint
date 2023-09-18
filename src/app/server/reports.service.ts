import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  env = environment;

  constructor(public http: HttpClient) { }

  // t =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXNobmFrYXJyaTExMUBnbWFpbC5jb20iLCJpYXQiOjE2OTIxODAzMjIsImV4cCI6MTY5MjI2NjcyMn0.-fsHO7Py6ZFON9XOZ7Pz6S2hYIriQUCb841IXRqR37E';

  // headers_object = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   Authorization: 'Bearer ' + this.t,
  // });

  // httpOptions = {
  //   headers: this.headers_object,
  // };

  getTopEmployeesInEachFunction(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/top_employees_in_each_function`,
      data
    );
  }

  getTopTaskAchievers(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/top_task_achievers`,
      data
    );
  }

  getEmployeeSlackingBetween60To80(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/employee_slacking_between_60_to_80`,
      data
    );
  }

  getPeopleProgressingTowardsBenchmark(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/people_progressing_towards_benchmark`,
      data
    );
  }

  getAllJobRolesInReports(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/get_all_job_roles_in_reports`,
      data
    );
  }

  getAllDepartmentsInReports(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/get_all_departments_in_reports`,
      data
    );
  }

  getOrgChartData(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/get_org_chart_data`,
      data
    );
  }

  getBaselineValues(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/get_baseline_values`,
      data
    );
  }

  updateBaselineValues(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/update_baseline_values`,
      data
    );
  }

  comparision(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/comparison`,
      data
    );
  }

  getRoles(value: any, obj: any) {
    if (value === 'department') {
      return this.http.get(
        environment.url + environment.candidatePath + `/get_department_values`
      );
    } else if (value === 'employee') {
      return this.http.post(
        environment.url + environment.employeePath + `/get_all_employees`,
        obj
      );
    } else if (value === 'role') {
      return this.http.post(
        environment.url + environment.candidatePath + `/get_all_job_roles`,
        obj
      );
    } else if (value === 'organization') {
      return of({code: 200, data: [{
        id: obj.orgCode,
        name: obj.organization
      }] })
    }
    return of([]);
  }
}
