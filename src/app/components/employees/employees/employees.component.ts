import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';
import { BubbleChartModel } from '../../d3-charts/data/data.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  @ViewChild('paginator') paginator: MatPaginator | undefined;

  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');

  currentRate = 3;
  toppingsControl = new FormControl<string[]>([]); // Form control for toppings selection
  evaluation_DropdwonForm = new FormControl([]); // Form control for evaluation dropdown selection
  bankFilterCtrl = new FormControl(); // Form control for bank filter
  toppingList: string[] = [
    // Array of available toppings
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];

  evaluvation_datalist = [
    // Array of evaluation options
    {
      id: 1,
      name: 'Team leader',
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
  filteredToppingList: string[] = []; // Array of filtered toppings
  pageEvent: PageEvent = new PageEvent();
  allEmployeesData: any;
  bubbleChartData: any[] = [];
  EmployeeCount: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(public router: Router, public api: ServerService, private cdr: ChangeDetectorRef, private http: HttpClient, public snackBar: MatSnackBar) {
    this.bankFilterCtrl.valueChanges.subscribe((value) => {
      // Subscribe to value changes in bank filter control
      this.filteredToppingList = this.filterToppings(value); // Filter toppings based on the entered value
    });
    this.filteredToppingList = this.toppingList; // Initialize filtered toppings list with all toppings
    this.getAllEmployeesData();
    this.getBubbleChartData();
    this.getorgEmployee();
  }
  private getBubbleChartData() {
    const data = {
      "email": this.loginEmail,
      "organization": this.organizationName,
      "orgCode": this.organizationCode
    };

    this.api.getEmployeeOrgBubbleChartData(data)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        next: (res: any) => {
          var response = res.data.map((item: any) => ({
            score: item.score,
            email: item.userId,
            branch: item.designation,
            dept: item.department
          }));

          var ranges: any[] = [
            { key: 100, display: '10%', topText: 'Perfect Fit', uniqueScores: [], min: 80, max: 100, count: 0, records: [] },
            { key: 80, display: '20%', topText: 'Good Fit', uniqueScores: [], min: 60, max: 79, count: 0, records: [] },
            { key: 60, display: '10%', topText: 'Neutral', uniqueScores: [], min: 40, max: 59, count: 0, records: [] },
            { key: 40, display: '20%', topText: 'Poor Fit', uniqueScores: [], min: 20, max: 39, count: 0, records: [] },
            { key: 20, display: '60%', topText: 'Unfit', uniqueScores: [], min: 0, max: 19, count: 0, records: [] },
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
            r.display =
              r.count ? Math.round((r.count * 100) / response.length) : 0;
            const uniqueScores = r.uniqueScores.sort();
            const firstPart = Math.round(uniqueScores.length / 2);
            const sum = uniqueScores.slice(0, firstPart).reduce((a: any, b: any) => a + b, 0);
            const sum2 = uniqueScores.slice(firstPart).reduce((a: any, b: any) => a + b, 0);
            r.averageScores = [{ average: (Math.round(sum / firstPart) || 0), count: firstPart },
            { average: (Math.round(sum2 / (uniqueScores.length - firstPart)) || 0), count: uniqueScores.length - firstPart }];
          });
          this.bubbleChartData = ranges;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('API error:', error);
          // Handle the error here, for example, display an error message
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

  onToppingRemoved(topping: string) {
    const toppings = this.toppingsControl.value as string[]; // Get the current selected toppings
    this.removeFirst(toppings, topping); // Remove the first occurrence of the topping
    this.toppingsControl.setValue(toppings); // Update the selected toppings
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove); // Find the index of the item to remove
    if (index !== -1) {
      array.splice(index, 1); // Remove the item from the array
    }
  }

  searchFilterLevel(event: any) {
    const filterValue = event.target.value.toLowerCase(); // Get the entered filter value
    this.bankFilterCtrl.setValue(filterValue); // Set the filter value in the form control
  }

  private filterToppings(value: string): string[] {
    if (!value) {
      return this.toppingList; // If no value provided, return all toppings
    }
    const filterText = value.toLowerCase(); // Convert the value to lowercase for case-insensitive comparison
    return this.toppingList.filter(
      (topping) => topping.toLowerCase().includes(filterText) // Filter toppings that include the filter text
    );
  }

  onRemoveEvalvationDropdown() {
    this.evaluation_DropdwonForm.setValue([]); // Clear the selected evaluation options
  }
  // ********************EMPLOYEE PROFILE ROUTE********************
  employeeProfileRoute(data: any) {
    console.log(data)
    this.router.navigate(['/employees/employeeprofile'], {
      queryParams: {
        userId: data.user_id,
      },
    });
  }

  getAllEmployeesData() {
    const obj = {
      "email": this.loginEmail,
      "orgCode": this.organizationCode,
      "organization": this.organizationName,
      "pageNo": 1,
      "pageSize": 5
    };

    this.api
      .getAllEmployeesData(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.allEmployeesData = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            console.log('getAllEmployeesData', response.data);
            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error getAllEmployeesData: Unexpected status code:',
              response.success
            );
            // Handle the error here, for example, display an error message
          }
        },
        error: (error: any) => {
          console.error('API error:', error);
          // Handle the error here, for example, display an error message
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
        this.router.navigate(['/login']);
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
    console.log('employees component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
