import { ChangeDetectorRef, Component } from '@angular/core';
import { ReportsService } from '../../../server/reports.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pre-generatereport',
  templateUrl: './pre-generatereport.component.html',
  styleUrls: ['./pre-generatereport.component.scss']
})
export class PreGeneratereportComponent {

  topEmployeesInEachFunction: any;
  topTaskAcheivers: any;
  employeeSlackingBetween60To80: any;
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public api: ReportsService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: Router,
  ) {
  }

  ngOnInit(): void {
    this.getTopEmployeesInEachFunction();
    this.getTopTaskAchievers();
    this.getEmployeeSlackingBetween60To80();
  }

  getEmployeeSlackingBetween60To80() {
    const obj = {
      orgCode: this.organizationCode
    };
    this.api
      .getEmployeeSlackingBetween60To80(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeeSlackingBetween60To80 = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            // console.log('getTopEmployeesInEachFunction', response.data);
            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error getTopEmployeesInEachFunction: Unexpected status code:',
              response.success
            );
            // Handle the error here, for example, display an error message
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getTopTaskAchievers() {
    const obj = {
      orgCode: this.organizationCode
    };
    this.api
      .getTopTaskAchievers(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.topTaskAcheivers = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            // console.log('getTopEmployeesInEachFunction', response.data);
            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error getTopEmployeesInEachFunction: Unexpected status code:',
              response.success
            );
            // Handle the error here, for example, display an error message
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getTopEmployeesInEachFunction() {
    const obj = {
      orgCode: this.organizationCode
    };
    this.api
      .getTopEmployeesInEachFunction(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.topEmployeesInEachFunction = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            // console.log('getTopEmployeesInEachFunction', response.data);
            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error getTopEmployeesInEachFunction: Unexpected status code:',
              response.success
            );
            // Handle the error here, for example, display an error message
          }
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
}
