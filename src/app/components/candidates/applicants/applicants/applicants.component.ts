import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuccessdialogComponent } from 'src/app/shared/successdialog/successdialog.component';

import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { LoadSpinnerService } from 'src/app/shared/load-spinner.service';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
})
export class ApplicantsComponent implements OnInit {
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  FilterpanelIsOpen = false;
  searchText = '';
  toppingsControl = new FormControl(); // Form control for toppings selection
  evaluation_DropdwonForm = new FormControl(); // Form control for evaluation dropdown selection
  department_DropdownForm = new FormControl([]); // Form control for department dropdown selection
  bankFilterCtrl = new FormControl(); // Form control for bank filter

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
  panelIsOpen: boolean = false;
  filteredToppingList: string[] = []; // Array of filtered toppings
  searchPanelIsOpen = false;
  allEmployeesData: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  statusData: any;
  // EvalutionFunctioList: any;
  departmentsDataList: any;
  RolesDataList: any;

  filterSelectedRoles: any[] = [];
  filteredRolesDataList: any;
  selectedStatus: any;
  totalCountOfEmployees: any;
  pageIndex = 1;
  pageSize = 32;
  selectedRolenamesEvent: any[] = [];
  roles: { role_name: string; role_id: number }[] = [];

  constructor(
    public api: ServerService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public route: Router,
    private loadSpinner: LoadSpinnerService
  ) {
    this.bankFilterCtrl.valueChanges.subscribe((value) => {
      console.log('bankFilterCtrl', value);
      // Subscribe to value changes in bank filter control
      this.filteredToppingList = this.filterToppings(value); // Filter toppings based on the entered value
    });
    // Initialize filtered toppings list with all toppings
    this.getAllCandidatesData();
  }

  ngOnInit(): void {
    // this.evaluation_DropdwonForm.setValue(); // Initialize evaluation dropdown value
    this.getAllRolesData();
    this.statusLevelDropDown();
    this.getDepartmentDropDown();
    // this.filteredRolesDataList = this.RolesDataList;
    // console.log('filteredRolesDataList:', this.filteredRolesDataList);
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    console.log('removeFirst', array, toRemove);
    const index = array.indexOf(toRemove); // Find the index of the item to remove
    if (index !== -1) {
      array.splice(index, 1); // Remove the item from the array
    }
  }

  searchFilterLevel(event: any) {
    console.log(event, 'event');
    console.log(this.toppingsControl, 'toppingsControl');
    const filterValue = event.target.value.toLowerCase(); // Get the entered filter value
    this.filteredRolesDataList = this.RolesDataList.filter((role: any) =>
      role.role_name.toLowerCase().includes(filterValue)
    );
    this.bankFilterCtrl.setValue(filterValue);
    console.log(this.filteredRolesDataList, 'filteredRolesDataList');
  }

  // *************GET DEPARTMNET **********
  getDepartmentDropDown() {
    this.api
      .getDepartmentsDropdown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.departmentsDataList = response.data;
          this.cdr.detectChanges();
          console.log('BUSSINESS FUNCTION:', this.departmentsDataList);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
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

  getAllCandidatesData() {
    this.loadSpinner.setLoading(true);

    const obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };

    this.api
      .getAllCnadidatesData(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.allEmployeesData = response.data;
          this.totalCountOfEmployees = response.total_count;
          this.loadSpinner.setLoading(false);

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
          }
        },
        error: (error: any) => {
          console.error('API error:', error);
          this.handleComponentError(error);
          // Handle the error here, for example, display an error message
        },
      });
  }

  getuserresultsViewAll(event: any) {
    console.log(event, 'event');
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getAllCandidatesData();
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
  private filterToppings(value: string): string[] {
    if (!value) {
      console.log('filteredRolesDataList', this.filteredRolesDataList);
      return (this.filteredRolesDataList = this.RolesDataList); // If no value provided, return all toppings
    }
    const filterText = value.toLowerCase(); // Convert the value to lowercase for case-insensitive comparison
    return this.filteredRolesDataList.filter(
      (role: any) => role.role_name.toLowerCase().includes(filterText) // Filter toppings that include the filter text
    );
  }

  onRemoveEvalvationDropdown() {
    this.evaluation_DropdwonForm.setValue(''); // Clear the selected evaluation options
  }
  onRemoveDepartmentDropdown() {
    this.department_DropdownForm.setValue([]); // Clear the selected department options
    console.log('DEPARTMENTVLAUE FORM:', this.department_DropdownForm);
    // if (this.department_DropdownForm === 0) {
    this.getAllRolesData();
    // }
  }
  handleOpen() {
    this.panelIsOpen = !this.panelIsOpen;
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

  onToppingRemoved(topping: any) {
    console.log('onToppingRemoved', topping);
    const roleIdToRemove = topping.role_id;
    this.filterSelectedRoles = this.filterSelectedRoles.filter(
      (roleId) => roleId !== roleIdToRemove
    );
    this.selectedRolenamesEvent = this.selectedRolenamesEvent.filter(
      (roleId) => roleId !== roleIdToRemove
    );
    const toppings = this.roles.filter(
      (role) => role.role_id !== roleIdToRemove
    );
    this.toppingsControl.setValue(toppings);
    this.roles = this.toppingsControl.value;
  }

  // *************ON ROLE CHANGE************

  onRoleChange(event: any) {
    this.roles = this.toppingsControl.value as {
      role_name: string;
      role_id: number;
    }[]; // Add this line

    this.selectedRolenamesEvent = [];
    this.selectedRolenamesEvent = this.roles.map((role: any) => role.role_id);
    console.log('selectedRolenamesEvent', this.selectedRolenamesEvent);

    this.toppingsControl.setValue(this.roles);

    console.log(this.toppingsControl, 'toppingsControl');
  }

  // ***********SEARCH FILTER*************
  searchFilter() {
    this.loadSpinner.setLoading(true);

    console.log('DEPARTMENTVLAUE FORM:', this.evaluation_DropdwonForm);
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
      pageNo: 1,
      pageSize: 102,
      userType: 'candidate',
      department: this.department_DropdownForm.value,
      roleIdArray: this.selectedRolenamesEvent,
      scale: this.evaluation_DropdwonForm.value?.value,
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
          this.loadSpinner.setLoading(false);
          if (response.code === 200) {
            this.cdr.detectChanges();
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

  // ***********RESPONSE SUCCESS*************
  responseSuccess(response: any) {
    this.snackBar.open(response.message, '×', {
      panelClass: ['custom-style'],
      verticalPosition: 'top',
    });
  }

  // ***********RESPONSE NO DATA*************
  responseNoData(response: any) {
    this.snackBar.open(response.message, '×', {
      panelClass: ['custom-style'],
      verticalPosition: 'top',
      duration: 3000,
    });
    // this.getAllCandidatesData();
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
  candidatesProfileRoute(data: any) {
    this.route.navigate(['candidates/Candidatesprofile'], {
      queryParams: { userId: data.user_id },
    });
  }

  bulkResumeUpload(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '900px',
    });
  }

  // *****************************
  onFileChangeEmployee(evt: any) {
    console.log(evt, 'evnt');
    // console.log(evt[0].name, 'filelist');
    // this.FileNameEmployees = evt[0].name;
    // if (evt.length !== 1) {
    //   throw new Error('Cannot use multiple files');
    // }
    // const reader: FileReader = new FileReader();
    // reader.onload = (e: any) => {
    //   const bstr: string = e.target.result;
    //   const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    //   const wsname: string = wb.SheetNames[0];
    //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    //   this.dataxlsxEmployee = XLSX.utils.sheet_to_json(ws, {
    //     header: 1,
    //   }) as AOA;
    //   console.log('fileUpload', this.dataxlsxEmployee);
    // };
    // reader.readAsBinaryString(evt[0]);
  }

  // openSuccessDialog() {
  //   this.dialog.closeAll();
  // }

  // openDialogAddStatus(templateRef: TemplateRef<any>) {
  //   this.dialog.closeAll();
  //   this.dialog.open(templateRef, {
  //     width: '900px',
  //   });
  // }

  // sending message from here to success dialog
  openSuccessDialog() {
    const message = 'Success ! Assigned Status';
    const note =
      'Selelcted 8 applicants from Sales business function will be assigned the status level of Interview Stage 2';
    this.dialog.closeAll();
    this.dialog.open(SuccessdialogComponent, {
      width: '900px',
      data: [
        {
          message: message,
          note: note,
        },
      ],
    });
  }

  // ***********CONFIRM ADD STATUS DIALOG OPEN************
  openconfirmAddstatus(templateRef: TemplateRef<any>) {
    this.dialog.closeAll();

    this.dialog.open(templateRef, {
      width: '900px',
    });
  }

  // ******************CLOSE BUTTON IN DIALOG BOX****************
  closedialog() {
    this.dialog.closeAll();
  }

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
