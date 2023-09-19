import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/server/reports.service';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';

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
  softSKillsColValues = [
    { name: 'ADAPTABILITY', key: 'adaptability' },
    { name: 'COMMUNICATION', key: 'communication' },
    { name: 'LEADERSHIP', key: 'leadership' },
    { name: 'TEAM WORK', key: 'teamwork' },
    { name: 'TIME MANAGEMENT', key: 'timemanagement' },
    { name: 'CREATIVITIY', key: 'creativity' },
    { name: 'ATTENTION TO DETAIL', key: 'attentiontodetail' },
    { name: 'INTERPERSONAL SKILLS', key: 'interpersonalskills' },
    { name: 'PROBLEM SOLVING', key: 'problemsolving' },
    { name: 'WORK EHTIC', key: 'workethic' }
  ];
  aptitudeColValues = [
    { name: 'REWARD', key: 'reward' },
    { name: 'PROFESSION', key: 'profession' },
    { name: 'SPIRIT', key: 'spirit' },
    { name: 'PURPOSE', key: 'purpose' }
  ];

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
  value1Data: any;
  value2Data: any;
  value1Result: any;
  value2Result: any;
  state: any;

  constructor(public api: ReportsService,
    private cdr: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: Router,
    private location:Location) {
  }

  ngOnInit(): void {
    console.log(this.location.getState());
    this.state = this.location.getState();
    this.comparision();
  }

  comparision() {
    const obj = {
      orgCode: this.organizationCode,
      // TODO - Below values need to correct and pass dynamically
      value1: {
        type: this.state.value1,
        value: this.state.value1Role
      },
      value2: {
        type: this.state.value2,
        value: this.state.value2Role
      }
    };
    this.api
      .comparision(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.comparisionResponse = response.data;
          this.value1Result = response.data[0].result;
          this.value2Result = response.data[1].result;
          this.value1Data = this.transformChartData(response.data[0].result.chartData);
          this.value2Data = this.transformChartData(response.data[1].result.chartData);
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

  departmentChartData(chart_data: any) {
    let chartData: any[] = [];
    if (chart_data && chart_data.adaptability) {
      Object.keys(chart_data).forEach((key: any) => {
        const skill1 = this.softSKillsColValues.find((s: any) => s.key.toLowerCase() === key.toLowerCase());
        const skill2 = this.aptitudeColValues.find((s: any) => s.key.toLowerCase() === key.toLowerCase());
        if (skill1 && chart_data[key]) {
          chartData.push({
            category: skill1.name,
            latest_value: parseInt(chart_data[key]) / 2,
            org_value: parseInt(chart_data[key]) / 2
          });
        }
        if (skill2 && chart_data[key]) {
          chartData.push({
            category: skill2.name,
            latest_value: parseInt(chart_data[key]) / 2,
            org_value: parseInt(chart_data[key]) / 2
          });
        }
      });
    }
    return chartData;
  }

  transformChartData(response: any) {
      let softSkillsBaseLineValues: any[] = [];
      let aptitudeBaseLineValues: any[] = [];
      Object.keys(response).forEach((key: any) => {
        const skill1 = this.softSKillsColValues.find((s: any) => s.key.toLowerCase() === key.toLowerCase());
        const skill2 = this.aptitudeColValues.find((s: any) => s.key.toLowerCase() === key.toLowerCase());
        if (skill1) {
          softSkillsBaseLineValues.push({
            category: skill1.name,
            latest_value: parseInt(response[key]) / 2,
            org_value: parseInt(response[key]) / 2
          });
        }
        if (skill2) {
          aptitudeBaseLineValues.push({
            category: skill2.name,
            latest_value: parseInt(response[key]) / 2,
            org_value: parseInt(response[key]) / 2
          });
        }
      });
      return [...softSkillsBaseLineValues, ...aptitudeBaseLineValues];
  }
  truncate(num:any, places: any){
    return Math.trunc(num * Math.pow(10,places)) / Math.pow(10, places);
  }
}
