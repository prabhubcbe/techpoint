import { ChangeDetectorRef, Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReportsService } from 'src/app/server/reports.service';

@Component({
  selector: 'app-baseline',
  templateUrl: './baseline.component.html',
  styleUrls: ['./baseline.component.scss'],
})
export class BaselineComponent {
  isFirstButtonActive: boolean = true;
  roles_onfirst = false;
  roles_onSecond = true;

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  baselineCol1Values: any[] = [];
  baselineCol2Values: any[] = [];
  chartData : any[] = [];
  skillSetCol1 = [
    { name: 'ADAPTABILITY', key: 'adaptability' },
    { name: 'COMMUNICATION', key: 'communication' },
    { name: 'LEADERSHIP', key: 'leadership' },
    { name: 'TEAM WORK', key: 'teamwork' },
    { name: 'TIME MANAGEMENT', key: 'timemanagement' },
    { name: 'CREATIVITIY', key: 'creativity' },
    { name: 'ATTENTION TO DETAIL', key: 'attentiontodetail' },
  ];
  skillSetCol2 = [
    { name: 'INTERPERSONAL SKILLS', key: 'interpersonalskills' },
    { name: 'PROBLEM SOLVING', key: 'problemsolving' },
    { name: 'WORK EHTIC', key: 'workethic' },
    { name: 'REWARD', key: 'reward' },
    { name: 'PROFESSION', key: 'profession' },
    { name: 'SPIRIT', key: 'spirit' },
    { name: 'PURPOSE', key: 'purpose' }
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
    this.getBaselineValues();
  }

  getBaselineValues() {
    const obj = {
      orgCode: this.organizationCode
    };
    this.api
      .getBaselineValues(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.baselineCol1Values = [];
          this.baselineCol2Values = [];
          this.chartData = [];
          if (response.data.length) {
            Object.keys(response.data[0]).forEach((key: any) => {
              const skill1 = this.skillSetCol1.find((s: any) => s.key.toLowerCase() === key.toLowerCase());
              const skill2 = this.skillSetCol2.find((s: any) => s.key.toLowerCase() === key.toLowerCase());
              if (skill1) {
                this.baselineCol1Values.push({
                  category: skill1.name,
                  latest_value: parseInt(response.data[0][key])/2,
                  org_value: parseInt(response.data[0][key])/2
                });
              }
              if (skill2) {
                this.baselineCol2Values.push({
                  category: skill2.name,
                  latest_value: parseInt(response.data[0][key])/2,
                  org_value: parseInt(response.data[0][key])/2
                });
              }
            });
            this.chartData = [...this.baselineCol1Values, ...this.baselineCol2Values];
          }
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            // console.log('getTopEmployeesInEachFunction', response.data);
            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error getBaselineValues: Unexpected status code:',
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


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  showRolesBaseline() {
    this.roles_onfirst = !this.roles_onfirst;
    this.roles_onSecond = !this.roles_onSecond;
  }

  // ************************* 1st Table ******************************
  toggleButtons() {
    this.isFirstButtonActive = !this.isFirstButtonActive;
  }
}
