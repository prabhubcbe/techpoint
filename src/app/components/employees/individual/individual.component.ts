import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss'],
})
export class IndividualComponent implements OnInit {
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  FilterpanelIsOpen = false;
  toppingsControl = new FormControl<string[]>([]); // Form control for toppings selection
  evaluation_DropdwonForm = new FormControl([]); // Form control for evaluation dropdown selection
  bankFilterCtrl = new FormControl(); // Form control for bank filter
  department_DropdownForm = new FormControl([])
  departmentsDataList: any;
  EvalutionFunctioList: any;
  filteredRolesDataList: any;
  searchText= '';
  AllRoles: any[] = [];
  totalPages: any;
  RolesDataList: any;
  filterSelectedRoles: any[] = [];
  selectedStatus: any;
  totalCountOfEmployees: any;
  statusData: any;
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
      id: 'Unfit',
      value: '0-20',
    },
    {
      id: 'Poorfit',
      value: '20-40',
    },
    {
      id: 'Neutral',
      value: '40-60',
    },
    {
      id: 'Goodfit',
      value: '60-80',
    },
    {
      id: 'PerfectFit',
      value: '80-100',
    },
  ];
  // evaluvation_datalist = [
  //   // Array of evaluation options
  //   {
  //     id: 1,
  //     name: 'Team leader',
  //   },
  //   {
  //     id: 2,
  //     name: 'Team member',
  //   },
  //   {
  //     id: 3,
  //     name: 'Software develop',
  //   },
  // ];
  panelIsOpen: boolean = false;
  filteredToppingList: string[] = []; // Array of filtered toppings
  searchPanelIsOpen = false;
  allEmployeesData: any;
  pageIndex = 1;
  pageSize = 8;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, public api: ServerService, private cdr: ChangeDetectorRef, private http: HttpClient, public snackBar: MatSnackBar)    {
    this.bankFilterCtrl.valueChanges.subscribe((value) => {
      // Subscribe to value changes in bank filter control
      this.filteredToppingList = this.filterToppings(value); // Filter toppings based on the entered value
    });
    this.filteredToppingList = this.toppingList; // Initialize filtered toppings list with all toppings
    //this.getAllEmployeesData();
    // this.pageIndex=1;
    // this.pageSize=10;
  }
  ngOnInit(): void {
    this.getAllEmployeesData()
    this.getDepartmentDropDown();
    this.getAllRolesData();
    this.statusLevelDropDown();
    console.log("FilterpanelIsOpen###");
    console.log(this.FilterpanelIsOpen);
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
  // *************ON DEPARTMNET CHANGE************
  onDepartmentChange(event: any) {
    console.log('onDepartmentChange', event);
    let obj = {
      email: this.loginEmail,
      organization: this.organizationName,
      department: event.value,
    };
    this.api
      .getRolesbyDepartment(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.RolesDataList = response.data;

            this.filteredRolesDataList = this.RolesDataList;
            this.cdr.detectChanges();
            console.log('ROLES DATA:', this.RolesDataList);
          } else if (response.code === 400) {
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
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
  searchFilterLevel(event: any) {
    const filterValue = event.target.value.toLowerCase(); // Get the entered filter value
    this.filteredRolesDataList = this.RolesDataList.filter((role: any) =>
      role.role_name.toLowerCase().includes(filterValue)
    );
    this.bankFilterCtrl.setValue(filterValue);
    console.log(this.filteredRolesDataList, 'filteredRolesDataList');
  }
  // ***********SEARCH FILTER*************
  searchFilter() {
    console.log('search filter');
    console.log('DEPARTMENTVLAUE FORM:', this.evaluation_DropdwonForm);
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
      pageNo: 1,
      pageSize: 102,
      userType: 'employee',
      department: this.department_DropdownForm.value,
      roleIdArray: this.filterSelectedRoles,
      scale: this.evaluation_DropdwonForm.value,
      status: this.selectedStatus,
    };
    console.log('SEARCH FILTER:', obj);
    this.api
      .searchFilterCandidates(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.allEmployeesData = response.data;
          this.totalCountOfEmployees = response.data.length;
          console.log('SEARCH FILTER RESPONSE:', response);
          if (response.code === 200) {
            console.log('SEARCH FILTER RESPONSE:', response.data);
            // this.responseSuccess(response);
          } else if (response.code === 400) {
            this.responseNoData(response);
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }
  // searchFilterLevel(event: any) {
  //   const filterValue = event.target.value.toLowerCase(); // Get the entered filter value
  //   this.bankFilterCtrl.setValue(filterValue); // Set the filter value in the form control
  // }

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
  handleOpen() {
    this.panelIsOpen = !this.panelIsOpen;
  }

  // *************************Hide and show filter options*************************
  toggleFilter() {
    this.FilterpanelIsOpen = !this.FilterpanelIsOpen;
    this.searchPanelIsOpen = false;
  }
  toggleSearch() {
    this.searchPanelIsOpen = !this.searchPanelIsOpen;
    this.FilterpanelIsOpen = false;
  }
  // **************CANDIDATES PROFILE PAGE ROUTE****************
  getAllEmployeesData() {
    const obj = {
      "email": this.loginEmail,
      "orgCode": this.organizationCode,
      "organization": this.organizationName,
      "pageNo": this.pageIndex,
      "pageSize": this.pageSize
    };

    this.api
      .getAllEmployeesData(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.allEmployeesData = response?.data;
          this.totalCountOfEmployees = response?.total_count;// get the total_count value from api, for now the api has to modify to get this value for setting pagination.
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
  // ********************EMPLOYEE PROFILE ROUTE********************
  employeeProfileRoute(data: any){
    this.router.navigate(['/employees/employeeprofile'], {
      queryParams: {
        userId: data.user_id,
      },
    });
  }
  getuserresultsViewAll(event: any) {
    console.log(event, 'event');
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getAllEmployeesData();
  }
  // ***********RESPONSE NO DATA*************
  responseNoData(response: any) {
    this.snackBar.open(response.message, '×', {
      panelClass: ['custom-style'],
      verticalPosition: 'top',
    });
    // this.getAllCandidatesData();
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
  // ********************get status drop down values *****************
  statusLevelDropDown() {
    this.api
      .getStatusLevelDropDown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.statusData = response.data;
          this.cdr.detectChanges();
          console.log('STATUS LEVEL DROPDOWN', response);
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
    console.log('individual component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
