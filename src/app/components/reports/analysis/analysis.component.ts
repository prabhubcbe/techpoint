import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ReportsService } from 'src/app/server/reports.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit{

  ngOnInit(): void {

  }
  
  roles1List: any = [];
  roles2List: any = [];
  value1: any;
  value2: any;
  value1Role: any;
  value2Role: any;
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  deptUpdate = new Subject<any>();

  valueList = [
    {
      name: 'DEPARTMENT',
      value: 'department'
    },
    {
      name: 'EMPLOYEE',
      value: 'employee'
    },
    {
      name: 'ROLE',
      value: 'role'
    },
    {
      name: 'ORGANIZATION',
      value: 'organization'
    }
  ]
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public api: ReportsService, public router: Router, public snackBar: MatSnackBar, private route: Router, private cdr: ChangeDetectorRef) {
    this.deptUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.getRoles(value);
      });
  }

  formatRolesResponse(value: any, data: any) {
    if (value === 'department') {
      return data.map((item: any) => {
        return {
          id: item,
          name: item
        };
      })
    } else if (value === 'employee') {
      return data.map((item: any) => {
        return {
          id: item.user_id,
          name: item.user_name
        };
      })
    } else if (value === 'role') {
      return data.map((item: any) => {
        return {
          id: item.role_id,
          name: item.role_name
        };
      })
    } else if (value === 'organization') {
      return data;
    }
  }

  filteredRoles1List: any = [];
  filteredRoles2List: any = [];

  onKey(value: any, rolesList: any) {
    if (rolesList === 1) {
      this.filteredRoles1List = this.search(value.target.value, this.roles1List);
    } else {
      this.filteredRoles2List = this.search(value.target.value, this.roles2List);
    }
  }

  search(value: string, rolesList: any) {
    let filter = value.toLowerCase();
    return rolesList.filter((option: any) => option.name.toLowerCase().includes(filter));
  }

  getRoles(value: any) {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };
    if (value.rolesList === 1) {
      this.roles1List = [];
      this.filteredRoles1List = [];
    } else {
      this.roles2List = [];
      this.filteredRoles2List = [];
    }
    this.api
      .getRoles(value.value, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const list = this.formatRolesResponse(value.value, response.data);
          if (value.rolesList === 1) {
            this.roles1List = list;
            this.filteredRoles1List = list;
          } else {
            this.roles2List = list;
            this.filteredRoles2List = list;
          }
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

  compareBtn() {
    this.router.navigateByUrl('/reports/analysis/comparsion', { state: { value1: this.value1, value2: this.value2, value1Role: this.value1Role, value2Role: this.value2Role } });
  }
  routeBaselinecomp() {
    this.router.navigate(['/reports/analysis/baseline']);
  }
}
