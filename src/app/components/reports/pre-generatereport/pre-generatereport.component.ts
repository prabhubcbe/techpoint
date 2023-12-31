import { ChangeDetectorRef, Component } from '@angular/core';
import { ReportsService } from '../../../server/reports.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pre-generatereport',
  templateUrl: './pre-generatereport.component.html',
  styleUrls: ['./pre-generatereport.component.scss']
})
export class PreGeneratereportComponent {

  topEmployeesInEachFunction: any;
  topTaskAcheivers: any;
  employeeSlackingBetween60To80: any;
  peopleProgressingTowardsBenchmark: any;
  roles1List: any = [];
  roles2List: any = [];
  filteredRoles1List: any = [];
  filteredRoles2List: any = [];
  roles3List: any = [];
  roles4List: any = [];
  filteredRoles3List: any = [];
  filteredRoles4List: any = [];
  value1: any;
  value2: any;
  value3: any;
  value4: any;
  QValue1: any;
  QValue2: any;
  QValue3: any;
  QValue4: any;
  quarters = [
    { id: "Q1", name: "Jan - Mar" },
    { id: "Q2", name: "Apr - Jun" },
    { id: "Q3", name: "Jul - Sep" },
    { id: "Q4", name: "Oct - Dec" },
  ];
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
    this.getPeopleProgressingTowardsBenchmark();
    this.loadDropDowns();
  }

  onKey(value: any, rolesList: any) {
    switch(rolesList) {
      case 1:
        this.filteredRoles1List = this.search(value.target.value, this.roles1List);
        break;
      case 2:
        this.filteredRoles2List = this.search(value.target.value, this.roles2List);
        break;
      case 3:
        this.filteredRoles3List = this.search(value.target.value, this.roles3List);
        break;
      case 4:
        this.filteredRoles4List = this.search(value.target.value, this.roles4List);
        break;
      default:
        break;
    }
  }

  search(value: string, rolesList: any) {
    let filter = value.toLowerCase();
    return rolesList.filter((option: any) => option.name.toLowerCase().includes(filter));
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

  getPeopleProgressingTowardsBenchmark() {
    const obj = {
      orgCode: this.organizationCode,
      pageNo: 1,
      pageSize: 6
    };
    this.api
      .getPeopleProgressingTowardsBenchmark(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.peopleProgressingTowardsBenchmark = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            // console.log('getPeoplProgressingTowardsBenchmark', response.data);
            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error getPeoplProgressingTowardsBenchmark: Unexpected status code:',
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


  loadDropDowns() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };
    this.roles1List = [];
    this.filteredRoles1List = [];
    this.roles2List = [];
    this.filteredRoles2List = [];
    this.roles3List = [];
    this.filteredRoles3List = [];
    this.roles4List = [];
    this.filteredRoles4List = [];

    this.api
      .getRoles("department", null)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const list = response.data && response.data.map((item: any) => {
            return {
              id: item,
              name: item
            };
          });
            this.roles1List = list;
            this.filteredRoles1List = list;
            this.roles2List = list;
            this.filteredRoles2List = list;
            this.roles3List = list;
            this.filteredRoles3List = list;
            this.roles4List = list;
            this.filteredRoles4List = list;

          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            // console.log('comparision', response.data);
            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error comparision: Unexpected status code:',
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
