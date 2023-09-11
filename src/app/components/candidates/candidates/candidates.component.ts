import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';
import { BubbleChartModel } from '../../d3-charts/data/data.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss'],
  providers: [DatePipe], // Include DatePipe in the providers array
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidatesComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator | undefined;

  lowValue: number = 0;
  highValue: number = 6;
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  department_DropdownForm = new FormControl([]); // Form control for department dropdown selection
  searchText = '';
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
      value: '0-20',
    },
    {
      id: 2,
      value: '20-40',
    },
    {
      id: 3,
      value: '40-60',
    },
    {
      id: 4,
      value: '60-80',
    },
    {
      id: 5,
      value: '80-100',
    },
  ];
  filteredToppingList: string[] = []; // Array of filtered toppings
  pageEvent: PageEvent = new PageEvent();
  allCandidatesData: any;
  bubbleChartData: any[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  AllRoles: any[] = [];
  sizeOfAllRoles: any;
  totalPages: any;
  allShortlistedCandidate: any;
  EvalutionFunctioList: any;
  idForRole: any;
  roleDetailsDelete: any;
  candidateCount: any;
  departmentsDataList: any;
  filteredRolesDataList: any;
  RolesDataList: any;
  constructor(
    public api: ServerService,
    private cdr: ChangeDetectorRef,
    private route: Router,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.bankFilterCtrl.valueChanges.subscribe((value) => {
      // Subscribe to value changes in bank filter control
      this.filteredToppingList = this.filterToppings(value); // Filter toppings based on the entered value
    });
    this.filteredToppingList = this.toppingList; // Initialize filtered toppings list with all toppings
  }
  ngOnInit(): void {
    this.getAllRoles();
    this.getAllShortListed();
    this.getDepartmentDropDown();
    this.getAllCandidatesData();
    this.getBubbleChartData();
    this.getorgCandidates();
    this.getAllRolesData();
  }

  onRemoveDepartmentDropdown() {
    this.department_DropdownForm.setValue([]); // Clear the selected department options
    // console.log('DEPARTMENTVLAUE FORM:', this.department_DropdownForm);
    // if (this.department_DropdownForm === 0) {
    // this.getAllRolesData();
    // }
  }

  getDepartmentDropDown() {
    this.api
      .getDepartmentsDropdown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.departmentsDataList = response.data;
          this.cdr.detectChanges();
          console.log('BUSSINESS FUNCTION:', this.EvalutionFunctioList);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  private getBubbleChartData() {
    const data = {
      email: this.loginEmail,
      organization: this.organizationName,
      orgCode: this.organizationCode,
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
    this.filteredRolesDataList = this.RolesDataList.filter((role: any) =>
      role.role_name.toLowerCase().includes(filterValue)
    );
    this.bankFilterCtrl.setValue(filterValue);
    console.log(this.filteredRolesDataList, 'filteredRolesDataList');
  }

  // ***************GETALL ROLES DATALIST****************
  getAllRolesData() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };
    this.api
      .getAllRoles(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          // Initialize filteredRolesDataList with all roles initially
          this.RolesDataList = response.data;
          this.filteredRolesDataList = this.RolesDataList;
          this.cdr.detectChanges();
          console.log('ROLES DATA:', this.RolesDataList);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
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

  formatDate(date: any) {
    const formattedDate = this.datePipe.transform(date, 'MMM d');
    return formattedDate || ''; // Return an empty string if formatting fails
  }

  getAllCandidatesData() {
    const obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
      pageNo: 1,
      pageSize: 6,
    };
    this.api
      .getRecommendedCandidatesHome(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.allCandidatesData = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            // console.log('getAllEmployeesData', response.data);
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

  getAllRoles() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };
    this.api
      .allRoles(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.AllRoles = response.data;
          this.totalPages = Math.ceil(this.AllRoles.length / 6);

          // this.sizeOfAllRoles=response.data.length;

          this.cdr.detectChanges();
          // console.log('ALL ROLES:', this.AllRoles);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  // **********RESULT CARD***********
  routeCandidate(data: any) {
    // console.log(data);
    this.route.navigate(['/candidates/Candidatesprofile'], {
      queryParams: {
        userId: data.user_id,
      },
    });
  }

  // **********GET ALL CANDIDATES SHORTLISTED DATA*********
  getAllShortListed() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };

    this.api
      .allShortlistedCandidates(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.allShortlistedCandidate = response.data;
          this.cdr.detectChanges();
          // console.log('SHORTLISTED CANDIDATES:', response);
        },
        error: (error: any) => {
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

  // ************OPEN DELETE DIALOG*************
  openDialogDelete(templateRef: TemplateRef<any>, deleteroleDetails: any) {
    console.log('DELETEROLEDIALOG:', deleteroleDetails);
    this.roleDetailsDelete = deleteroleDetails;
    this.dialog.open(templateRef, {
      width: '900px',
    });
  }

  // ***********DELETE ROLE****************
  deleteRole() {
    let obj = {
      roleIdArray: [this.roleDetailsDelete.role_id],
    };
    this.api
      .deleteRoleById(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.dialog.closeAll();
            this.getAllRoles();
            this.snackBar.open(response.message, 'x', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
          }
          console.log('DELETE ROLE:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  closedialog() {
    this.dialog.closeAll();
  }

  // **********ROUTING TO ROLES WHEN ADD ROLE********
  routeRoles() {
    this.route.navigate(['/roles']);
  }

  // ************EDIT ROLE*************
  editRole(data: any) {}

  // *****************NG DESTROY**************
  ngOnDestroy(): void {
    console.log('applicants component destroyed');
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
}
