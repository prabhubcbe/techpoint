import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  env = environment;
  constructor(public http: HttpClient) {}

  loginApi(data: any) {
    return this.http.post(environment.url + `/auth/login`, data);
  }
  otpVerification(data: any) {
    return this.http.post(environment.url + `/auth/verify_otp`, data);
  }

  signUp(data: any) {
    return this.http.post(
      environment.url + environment.authPath + `/signup`,
      data
    );
  }

  forgotPassword(data: any) {
    return this.http.post(
      environment.url + environment.authPath + '/forgot_password',
      data
    );
  }
  resetPassword(data: any) {
    return this.http.post(
      environment.url + environment.authPath + `/reset_password`,
      data
    );
  }
}
