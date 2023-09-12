import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  env = environment;

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

  getBaselineValues(data: any) {
    return this.http.post(
      environment.url + environment.reportsPath + `/get_baseline_values`,
      data
    );
  }
}
