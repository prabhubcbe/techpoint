import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  // ViewChild,
} from '@angular/core';

import { Observable, Subject, range, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {
  BubbleChartModel,
  DataModel,
  // RadialDataModel,
} from 'src/app/components/d3-charts/data/data.model';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { local } from 'd3';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  divbox: any;
  promptText: any;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 24,
    navSpeed: 700,
    navText: [
      ' <i class="fa-solid fa-arrow-left"></i>',

      '<i class="fa-solid fa-arrow-right"></i>',
    ],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      1366: {
        items: 4,
      },
    },
    nav: true,
  };

  recentActivity: any;
  categoriesData: any;
  employeeCategoriesData: any;
  allEmployeesData: any;
  hidePromptText = true;
  promptinputValue: any;
  employeesInTeambubbleChartData: any;
  candidateOrgbubbleChartData: any;
  employeeOrgbubbleChartData: any;
  recentRolesList: any;
  recentMessages: any;
  idForRole: any;
  departmnetCount: any;
  candidateCount: any;
  EmployeeCount: any;

  constructor(
    public api: ServerService,
    private cdr: ChangeDetectorRef,
    // private http: HttpClient,
    public snackBar: MatSnackBar,
    public route: Router
  ) {}
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private getEmployeesInTeamOrgBubbleChartData() {
    const data = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .getEmployeesInTeamOrgBubbleChartData(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          var response = res.data.map((item: any) => ({
            score: item.score,
            email: item.userId,
            branch: item.designation,
            dept: item.department,
          }));

          var ranges: any[] = [
            {
              key: 100,
              display: '10%',
              topText: 'Perfect Fit',
              uniqueScores: [],
              min: 80,
              max: 100,
              count: 0,
              records: [],
            },
            {
              key: 80,
              display: '20%',
              topText: 'Good Fit',
              uniqueScores: [],
              min: 60,
              max: 79,
              count: 0,
              records: [],
            },
            {
              key: 60,
              display: '10%',
              topText: 'Neutral',
              uniqueScores: [],
              min: 40,
              max: 59,
              count: 0,
              records: [],
            },
            {
              key: 40,
              display: '20%',
              topText: 'Poor Fit',
              uniqueScores: [],
              min: 20,
              max: 39,
              count: 0,
              records: [],
            },
            {
              key: 20,
              display: '60%',
              topText: 'Unfit',
              uniqueScores: [],
              min: 0,
              max: 19,
              count: 0,
              records: [],
            },
          ];
          response.map((item: BubbleChartModel) => {
            const data2 = ranges.find(
              (i) => item.score >= i.min && item.score <= i.max
            );
            if (data2) {
              data2.records.push(item);
              data2.count += 1;
              if (!data2.uniqueScores.includes(item.score)) {
                data2.uniqueScores.push(item.score);
              }
            }
          });
          ranges.map((r) => {
            r.display = r.count
              ? Math.round((r.count * 100) / response.length)
              : 0;
            const sum = r.uniqueScores.reduce((a: any, b: any) => a + b, 0);
            r.averageScores = [
              {
                average: Math.round(sum / r.uniqueScores.length) || 0,
                count: r.uniqueScores.length,
              },
            ];
          });
          this.employeesInTeambubbleChartData = ranges;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  private getEmployeeOrgBubbleChartData() {
    const data = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .getEmployeeOrgBubbleChartData(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          var response = res.data.map((item: any) => ({
            score: item.score,
            email: item.userId,
            branch: item.designation,
            dept: item.department,
          }));

          var ranges: any[] = [
            {
              key: 100,
              display: '10%',
              topText: 'Perfect Fit',
              uniqueScores: [],
              min: 80,
              max: 100,
              count: 0,
              records: [],
            },
            {
              key: 80,
              display: '20%',
              topText: 'Good Fit',
              uniqueScores: [],
              min: 60,
              max: 79,
              count: 0,
              records: [],
            },
            {
              key: 60,
              display: '10%',
              topText: 'Neutral',
              uniqueScores: [],
              min: 40,
              max: 59,
              count: 0,
              records: [],
            },
            {
              key: 40,
              display: '20%',
              topText: 'Poor Fit',
              uniqueScores: [],
              min: 20,
              max: 39,
              count: 0,
              records: [],
            },
            {
              key: 20,
              display: '60%',
              topText: 'Unfit',
              uniqueScores: [],
              min: 0,
              max: 19,
              count: 0,
              records: [],
            },
          ];
          response.map((item: BubbleChartModel) => {
            const data2 = ranges.find(
              (i) => item.score >= i.min && item.score <= i.max
            );
            if (data2) {
              data2.records.push(item);
              data2.count += 1;
              if (!data2.uniqueScores.includes(item.score)) {
                data2.uniqueScores.push(item.score);
              }
            }
          });
          ranges.map((r) => {
            r.display = r.count
              ? Math.round((r.count * 100) / response.length)
              : 0;
            const sum = r.uniqueScores.reduce((a: any, b: any) => a + b, 0);
            r.averageScores = [
              {
                average: Math.round(sum / r.uniqueScores.length) || 0,
                count: r.uniqueScores.length,
              },
            ];
          });
          this.employeeOrgbubbleChartData = ranges;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  private getCandidateOrgBubbleChartData() {
    const data = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .getCandidateOrgBubbleChartData(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          var response = res.data.map((item: any) => ({
            score: item.score,
            email: item.userId,
            branch: item.designation,
            dept: item.department,
          }));

          var ranges: any[] = [
            {
              key: 100,
              display: '10%',
              topText: 'Perfect Fit',
              uniqueScores: [],
              min: 80,
              max: 100,
              count: 0,
              records: [],
            },
            {
              key: 80,
              display: '20%',
              topText: 'Good Fit',
              uniqueScores: [],
              min: 60,
              max: 79,
              count: 0,
              records: [],
            },
            {
              key: 60,
              display: '10%',
              topText: 'Neutral',
              uniqueScores: [],
              min: 40,
              max: 59,
              count: 0,
              records: [],
            },
            {
              key: 40,
              display: '20%',
              topText: 'Poor Fit',
              uniqueScores: [],
              min: 20,
              max: 39,
              count: 0,
              records: [],
            },
            {
              key: 20,
              display: '60%',
              topText: 'Unfit',
              uniqueScores: [],
              min: 0,
              max: 19,
              count: 0,
              records: [],
            },
          ];
          response.map((item: BubbleChartModel) => {
            const data2 = ranges.find(
              (i) => item.score >= i.min && item.score <= i.max
            );
            if (data2) {
              data2.records.push(item);
              data2.count += 1;
              if (!data2.uniqueScores.includes(item.score)) {
                data2.uniqueScores.push(item.score);
              }
            }
          });
          ranges.map((r) => {
            r.display = r.count
              ? Math.round((r.count * 100) / response.length)
              : 0;
            const sum = r.uniqueScores.reduce((a: any, b: any) => a + b, 0);
            r.averageScores = [
              {
                average: Math.round(sum / r.uniqueScores.length) || 0,
                count: r.uniqueScores.length,
              },
            ];
          });
          this.candidateOrgbubbleChartData = ranges;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  ngOnInit(): void {
    // console.log(this.organizationCode, 'organizationCode');
    // console.log(this.organizationName, 'organizationName');
    this.getorgDetails();
    this.getRecentActivity();
    this.getAllEmployeesData();
    this.getRecentRoles();
    this.getRecentMessages();
    this.getorgEmployee();
    this.getorgCandidates();
    this.getorgDepartment();
    this.getEmployeesInTeamOrgBubbleChartData();
    this.getCandidateOrgBubbleChartData();
    this.getEmployeeOrgBubbleChartData();
    this.promptText =
      'Enter prompt For example, show me the most creative people who joined in the last two years in our Asia marketing team.';
  }

  ngOnDestroy(): void {
    console.log('home component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // ******************GLOBAL ERROR HANDLING FUNCTION******************
  handleComponentError(error: any) {
    console.log(error, 'handleComponentError');
    if (error.status === 400 && error.error && error.error.errors) {
      for (const key in error.error.errors) {
        if (error.error.errors.hasOwnProperty(key)) {
          const dynamicError = error.error.errors[key];
          this.snackBar.open(dynamicError.msg, '×', {
            panelClass: ['custom-style'],
            verticalPosition: 'top',
          });
          console.log(dynamicError.value);
          console.log(dynamicError.msg);
        }
      }
    } else if (
      error.status === 401 &&
      error.error.code === 401 &&
      error.error
    ) {
      this.route.navigate(['/login']);
      localStorage.clear();
      // Snackbar
      this.snackBar.open(error.error.errors.server.msg, '×', {
        panelClass: ['custom-style'],
        verticalPosition: 'top',
      });
    } else if (
      error.status === 500 &&
      error.error &&
      error.error.code === 500
    ) {
      const databaseError = error.error.errors.server.msg;
      console.log('500 error', databaseError);
      // Handle the database error further if needed
      this.snackBar.open(error.error.errors.server.msg, '×', {
        panelClass: ['custom-style'],
        verticalPosition: 'top',
      });
    } else {
      this.snackBar.open('An error occurred. Please try again later.', '×', {
        panelClass: ['custom-style'],
        verticalPosition: 'top',
        duration: 6000,
      });
    }
  }

  getorgDetails() {
    this.api
      .getOrgDetails(this.loginEmail)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          // console.log('ORG DETAILS:', response);
          // Manually trigger change detection
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }
  // ***************get organization counts********
  getorgDepartment() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .getdepartmentOrgCount(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.departmnetCount = response.data;
          this.cdr.detectChanges();
          console.log('ORG DETAILS:', response);
          // Manually trigger change detection
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getorgCandidates() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .getCandidatesOrgCount(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.candidateCount = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getorgEmployee() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .getEmployeesOrgCount(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.EmployeeCount = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getRecentActivity() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .recentActivities(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.recentActivity = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            // console.log('responserecentActivity', response);
            // Further operations with the response data can be performed here
          }
        },
        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  // *********************RECENT ROLES************
  getRecentRoles() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };
    this.api
      .recentRoles(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.recentRolesList = response.data;
          this.cdr.detectChanges();
        },

        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  // ************getrolebyID*************
  getRoleById(data: any) {
    console.log(data);
    this.idForRole = data.role_id;
    this.route.navigate(['roles/RoleProfile'], {
      queryParams: {
        role_id: data.role_id,
      },
    });
  }

  // *************EMPLOYEE PROFILE**************
  routeEmployeeProfile(data: any) {
    this.route.navigate(['employees/employeeprofile'], {
      queryParams: {
        userId: data.user_id,
      },
    });
  }

  // ****************recent activity route to user***********
  routeUserProfile(userProfile: any) {
    console.log(userProfile, 'userProfile');
    if (userProfile.user_role === 'candidates') {
      this.route.navigate([`${userProfile.user_role}/Candidatesprofile`], {
        queryParams: {
          userId: userProfile.user_id,
        },
      });
    } else if (userProfile.user_role === 'employees') {
      this.route.navigate([`${userProfile.user_role}/employeeprofile`], {
        queryParams: {
          userId: userProfile.user_id,
        },
      });
    }
  }

  // *************recent messages route to user***********
  routeMessagesUser(userProfile: any) {
    console.log(userProfile, 'userProfile');
    if (userProfile.user_role === 'candidates') {
      this.route.navigate([`${userProfile.user_role}/Candidatesprofile`], {
        queryParams: {
          userId: userProfile.user_id,
        },
      });
    } else if (userProfile.user_role === 'employees') {
      this.route.navigate([`${userProfile.user_role}/employeeprofile`], {
        queryParams: {
          userId: userProfile.user_id,
        },
      });
    }
  }

  // ******************
  // getData(e: any) {
  //   //alert(e.target);
  //   this.divbox = !this.divbox;
  //   return this.setData(e);
  // }

  // setData(e: any) {}

  getAllEmployeesData() {
    const obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
      pageNo: 1,
      pageSize: 6,
    };

    this.api
      .getTopEmployeesHome(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.allEmployeesData = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            console.log('getAllEmployeesData', response.data);
            // Further operations with the response data can be performed here

            // Handle the error here, for example, display an error message
          }
        },
        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  getRecentMessages() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .recentMessage(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.recentMessages = response.data;
          // console.log('RECENTMESSAGES:', this.recentMessages);
        },
        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  getEmployeeCategoriesData() {
    let obj = {
      login_email: 'hemanth.rapeti@chromiumsolutions.com',
      org_names: 'Chromium Solutions',
    };
    this.api
      .getEmployeeCategoriesData(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeeCategoriesData = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.status === 'success') {
            console.log('getEmployeeCategoriesData', response.data);
            // Further operations with the response data can be performed here
          }
        },
        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  // getCategoriesData() {
  //   let obj = {
  //     login_email: 'hemanth.rapeti@chromiumsolutions.com',
  //     org_names: 'Catenate',
  //   };

  //   this.api
  //     .getCategoriesData(obj)
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe({
  //       next: (response: any) => {
  //         this.categoriesData = response.data;
  //         // Manually trigger change detection
  //         this.cdr.detectChanges();
  //         if (response.status === 'success') {
  //           console.log('getCategoriesData', response.data);
  //           // Further operations with the response data can be performed here
  //         } else {
  //           console.error(
  //             'API error getCategoriesData: Unexpected status code:',
  //             response.success
  //           );
  //           // Handle the error here, for example, display an error message
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error('API error:', error);
  //         // Handle the error here, for example, display an error message
  //       },
  //     });
  // }

  // ***************************
  focusFunction() {
    this.hidePromptText = false;
    // this.route.navigate(['search']);
  }

  focusOutFunction() {
    if (this.promptinputValue) {
      this.hidePromptText = false;
    } else {
      this.hidePromptText = true;
    }
  }
}
