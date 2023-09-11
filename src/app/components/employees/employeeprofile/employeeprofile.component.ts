import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';

@Component({
  selector: 'app-employeeprofile',
  templateUrl: './employeeprofile.component.html',
  styleUrls: ['./employeeprofile.component.scss']
})
export class EmployeeprofileComponent implements OnInit{
  @ViewChild('paginator') paginator: MatPaginator | undefined;
  employeeDetails: any = { user_id: '' };
  employeBio: any = {};
  employeeHighlights: any = {}
  suggestedTask: any = []
  employeeRoles: any[] = [];
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  pageEvent: PageEvent = new PageEvent();

  constructor(
    public routerActive: ActivatedRoute,
    public snackBar: MatSnackBar,
    private api: ServerService,
    public route: Router,
    private location: Location,
  ) {}
  
  ngOnInit(): void {
    this.employeeDetails.user_id = this.routerActive.snapshot.queryParams['userId'];
    this.getEmployeeDetails();
    this.getHardSkill();
    this.getHighlights();
    this.getSuggestedTasks();
    this.getRoles();
  }

  onPopState() {
    this.location.back();
    console.log(this.location, 'location');
  }

  getEmployeeDetails() {
    let obj = {
      userId: this.employeeDetails.user_id,
      email: this.loginEmail,
      organization: this.organizationName,
      orgCode: this.organizationCode,
    };
    this.api
      .getUserById(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeeDetails = response.data;
          console.log('EMPLOYEE PROFILE', this.employeeDetails);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
    });
  }

  getHighlights() {
    let obj = {
      userId: this.employeeDetails.user_id,
    };
    this.api
      .getProfileIntelligence(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeeHighlights = response.data;
          console.log('HIGHLIGHTS:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getHardSkill() {
    let obj = {
      userId: this.employeeDetails.user_id,
    };
    this.api
      .getHardskillsById(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeBio = response.data;
          console.log('HARDSKILLS:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getRoles() {
    let obj = {
      userId: this.employeeDetails.user_id,
      email: this.loginEmail,
      organization: this.organizationName,
    };
    this.api
      .getRecommendedJobs(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeeRoles = response.data;
          console.log('ROLES:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getSuggestedTasks() {
    let obj = {
      userId: this.employeeDetails.user_id,
      email: this.loginEmail,
      organization: this.organizationName
    };
    this.api
      .getAction(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.suggestedTask = response.data;
          console.log('SUGGESTED TASKS:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
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

  ngOnDestroy(): void {
    console.log('employee profile component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
