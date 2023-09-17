import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/server/reports.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-comparsion',
  templateUrl: './comparsion.component.html',
  styleUrls: ['./comparsion.component.scss'],
})
export class ComparsionComponent {
  evaluation_DropdwonForm = new FormControl([]); // Form control for evaluation dropdown selection
  guageValue1 = ' 70%';
  gaugeType: NgxGaugeType = 'semi';
  gaugeValue = 70;
  guageSizethick = 27;
  gaugeAppendText = '%';

  gaugecolor = '#2e585b';
  evaluvation_datalist = [
    // Array of evaluation options
    {
      id: 1,
      name: 'All Time',
    },
    {
      id: 2,
      name: 'Team member',
    },
    {
      id: 3,
      name: 'Software develop',
    },
  ];
  onRemoveEvalvationDropdown() {
    this.evaluation_DropdwonForm.setValue([]); // Clear the selected evaluation options
  }

  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  comparisionResponse: any[] = [];

  constructor(public api: ReportsService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: Router) {
  }

  ngOnInit(): void {
    this.comparision();
  }

  comparision() {
    const obj = {
      orgCode: this.organizationCode,
      // TODO - Below values need to correct and pass dynamically
      value1: {
        type: "department",
        value: "IT"
      },
      value2: {
        type: "organization",
        value: "CAT-1000"
      }
    };
    this.api
      .comparision(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.comparisionResponse = response.data;
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
