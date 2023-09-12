import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
  Observable,
  ReplaySubject,
  Subject,
  map,
  startWith,
  takeUntil,
} from 'rxjs';
import { SuccessdialogComponent } from 'src/app/shared/successdialog/successdialog.component';
import { ServerService } from 'src/app/server/server.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

export interface Fruit {
  name: string;
}

interface Question {
  category: string;
  question: string;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent implements OnInit {
  @ViewChild('inputValue', { static: false })
  inputValue!: ElementRef<HTMLInputElement>;
  pageEvent: PageEvent = new PageEvent();
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  searchText = '';
  // ******************AUTO COMPLETE******************
  bankMultiCtrl = new FormControl();
  public bankMultiFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredBanksMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  employeesNames: any[] = [];
  // ******************AUTO COMPLETE******************

  // ******************INPUT CHIPS******************
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  // ******************INPUT CHIPS******************
  panelIsOpen: boolean = false;
  panelIsOpenSORT = false;
  selectedButton = '';
  AllRoles: any[] = [];
  EvalutionFunctioList: any;
  totalPages: any;
  // rolesQuestions: any;
  // employeesNames: any;

  // ***********slider roles
  max = 10;
  min = 0;
  showTicks = true;
  step = 0.5;
  thumbLabel = true;
  sliderValues: { value: number; category: string }[] = [];

  rolesQuestions: Question[] = [];
  employeeRoleBtn = false;
  scratchRoleBtn = false;
  slectedEmployees: any;
  rolesSavedCount: any;
  roleDetailsDelete: any;
  deleteRoleIds: any[] = [];
  checkAll = false;
  roleDetails: any;
  selectedDepartment: any;
  selectedSortBy: any;
  generatedJobDescription: any;
  roleGenerationData: any;
  // value = 0;
  ngOnInit(): void {
    this.getDepartmentDropDown();
    this.getAllRoles();
    this.EmployeesDropDown();
    this.createRolesQuestions();

    // Listen for search field value changes employees drop down
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

    // ***********slider
    // this.rolesQuestions?.forEach(() => this.sliderValues.push(0));
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public api: ServerService,
    public snackBar: MatSnackBar,
    private route: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  // ******************
  filterBanksMulti() {
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.employeesNames.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanksMulti.next(
      this.employeesNames.filter(
        (bank: { user_name: string }) =>
          bank.user_name.toLowerCase().indexOf(search) > -1
      )
    );
  }
  handleOpen() {
    this.panelIsOpen = !this.panelIsOpen;
  }

  handleOpenSORT() {
    this.panelIsOpenSORT = !this.panelIsOpenSORT;
  }

  // *********slider value**********
  // pitchSlider(event: any, index: number, category: any) {
  //   console.log('SLIDER:', event, index);
  //   // this.sliderValues[index+1] = event.value;
  //   // this.sliderValues.push({
  //   //   category: category.category,
  //   //   value: event.target.value,
  //   // });
  //   this.sliderValues[index] = {
  //     value: this.sliderValues[index]?.value || 0, // Default to 0 if not set
  //     category: category.category,
  //   };
  //   console.log('SLIDERINPUT:', this.sliderValues);
  // }

  // **********create role based on employees *************
  addRoleBasedOnEmployee(templateRef: TemplateRef<any>) {
    console.log('addRoleBasedOnEmployee');
    this.dialog.open(templateRef, {
      width: '900px',
      // height: '450px',
      panelClass: 'bg-color',
    });
  }

  // *************ROLES QUESTIONS***********
  createRolesQuestions() {
    this.api
      .getRolesQuestions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.rolesQuestions = response.data;
          console.log('createRoleQuestions:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  // *********create rolefrom employee **********
  employeeRoleSubmit(formdata: any) {
    console.log('formdata', formdata);
    if (
      formdata.roleName === '' &&
      formdata.department === '' &&
      formdata.level === '' &&
      formdata.description === ''
    ) {
      this.snackBar.open('Please fill all the fields', 'x', {
        panelClass: ['custom-style'],
        verticalPosition: 'top',
        duration: 6000,
      });
      return;
    } else {
      let obj = {
        email: this.loginEmail,
        orgCode: this.organizationCode,
        organization: this.organizationName,
        userIdArray: this.slectedEmployees,
        roleName: formdata.roleName,
        department: formdata.department,
        level: formdata.level,
        description: formdata.description,
      };
      console.log('employeeRoleSubmit:', obj);

      this.api
        .createRoleFromEmployee(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (response: any) => {
            console.log('createRoleFromEmployee:', response);
            if (response.code === 200) {
              this.rolesSavedCount = response.data;
              console.log(this.rolesSavedCount, 'this.rolesSavedCount');
              this.openSuccessDialog();
              this.getAllRoles();
              this.slectedEmployees = [];
              this.snackBar.open(response.message, 'x', {
                panelClass: ['custom-style'],
                verticalPosition: 'top',
                duration: 6000,
              });
              this.filteredBanksMulti.next(this.employeesNames.slice());
              console.log(this.rolesSavedCount, 'this.rolesSavedCount');
            }
          },
          error: (error: any) => {
            this.handleComponentError(error);
          },
        });
    }
  }
  // **************create role with questions *************
  roleForQuestions() {
    console.log('formdata', this.roleDetails);
    console.log('SLIDERINPUT:', this.sliderValues);
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
      userIdArray: this.slectedEmployees,
      roleName: this.roleDetails.roleName,
      department: this.roleDetails.department,
      level: this.roleDetails.level,
      description: this.roleDetails.description,
      roleValues: this.sliderValues,
    };
    console.log('roleForQuestions:', obj);
    this.api
      .createRoleFromScratch(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('createRoleFromScratch:', response);
          if (response.code === 200) {
            this.snackBar.open(response.message, 'x', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
              duration: 6000,
            });
            this.dialog.closeAll();
            this.getAllRoles();
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  // *********SLIDER VALUES***************
  getSliderValue(index: number): number {
    if (this.sliderValues[index]) {
      console.log('getSliderValue:', this.sliderValues[index].value);
      return this.sliderValues[index].value;
    }
    return 0; // Default value if not set
  }

  setSliderValue(newValue: number, index: number): void {
    if (!this.sliderValues[index]) {
      this.sliderValues[index] = {
        value: 0,
        category: this.rolesQuestions[index].category,
      };
    }
    this.sliderValues[index].value = newValue;
  }

  // ***********Dialog close************
  closeDialogEmployee() {
    this.slectedEmployees = [];
    this.dialog.closeAll();
  }

  // ****************CREATE NEW ROLE****************
  // createNewRole(templateRef: TemplateRef<any>) {
  //   this.dialog.open(templateRef, {
  //     width: '900px',
  //     pannelClass: 'bg-color',
  //   });
  // }

  createNewRole(templateRef: TemplateRef<any>) {
    this.employeeRoleBtn = false;
    this.scratchRoleBtn = true;
    console.log('addRoleBasedOnEmployee');
    this.dialog.open(templateRef, {
      width: '900px',
      // height: '450px',
      panelClass: 'bg-color',
    });
  }
  // *******************roles questions *****************
  openROLEQUESTIONDialog(templateRef: TemplateRef<any>, formdata: FormData) {
    this.dialog.closeAll();
    this.roleDetails = formdata;

    this.dialog.open(templateRef, {
      width: '1100px',
    });
  }

  // ***************CREATING ROLE USING EMPLOYEES*************
  createNewRoleEmployee(templateRef: TemplateRef<any>) {
    this.employeeRoleBtn = true;
    this.scratchRoleBtn = false;
    console.log('addRoleBasedOnEmployee');
    this.dialog.open(templateRef, {
      width: '900px',
      // height: '450px',
      panelClass: 'bg-color',
    });
  }

  // }*************************SUCCESS DIALOG******************

  // sending message from here to success dialog
  openSuccessDialog() {
    const message = `Complete! ${this.rolesSavedCount.length} New Roles have been created based on employees`;
    const note = `Based on the employees selected, ${this.rolesSavedCount[0].role_name} roles have been created`;
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
  // ****************EDIT ROLE *****************
  editRole(editData: any) {
    console.log('editData', editData);
    this.router.navigate(['roles/RoleProfile'], {
      queryParams: {
        role_id: editData.role_id,
        // editable: 'edit',
      },
    });
    let newValue = 'edit';
    this.api.setEditable(newValue);
  }

  // *****************INPUT CHIPS*****************
  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    console.log(this.fruits, 'this.fruits remove');
  }

  // <!-- mat input filed with mat chips on top of input -->
  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our fruit
  //   if ((value || '').trim()) {
  //     this.fruits.push({ name: value.trim() });
  //   }
  // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  removeLastChip(): void {
    if (this.inputValue.nativeElement.value === '' && this.fruits.length > 0) {
      this.fruits.pop();
    }
    console.log(this.fruits, 'this.fruitsremoveLastChip');
  }

  add(newFruit: string): void {
    if (newFruit && newFruit.trim() !== '') {
      this.fruits.push({ name: newFruit.trim() });
    }
    console.log(this.fruits, 'this.fruits add');
  }

  // ********************************
  selectButton(button: string) {
    this.selectedButton = button;
  }

  // *****************
  isWithin24Hours(date: string): boolean {
    const now = new Date();
    const roleDate = new Date(date);
    const timeDifference = now.getTime() - roleDate.getTime();
    return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // ************getrolebyID*************
  getRoleById(data: any) {
    // console.log(data);
    // this.idForRole = data.role_id;
    this.route.navigate(['roles/RoleProfile'], {
      queryParams: {
        role_id: data.role_id,
      },
    });
    let newValue = '';
    this.api.setEditable(newValue);
  }

  // *************ALL ROLES*************
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
          // this.AllRoles = response.data;
          this.AllRoles = response.data.map((role: any) => ({
            ...role,
            checked: false, // Add the 'checked' property with value 'false'
          }));
          this.totalPages = Math.ceil(this.AllRoles.length / 16);
          // this.sizeOfAllRoles=response.data.length;
          this.cdr.detectChanges();
          console.log('ALL ROLES:', this.AllRoles);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  // *************DEPARTMENT ROLES***************

  filterByDepartment(event: any) {
    console.log('DEPARTMENT:', event);
    this.selectedDepartment = event.value;
    if (this.selectedDepartment === 'All') {
      this.getAllRoles();
    } else {
      let obj = {
        email: this.loginEmail,
        orgCode: this.organizationCode,
        organization: this.organizationName,
        department: this.selectedDepartment,
        sortBy: this.selectedSortBy,
      };

      this.api
        .allRoles(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (response: any) => {
            if (response.code === 200) {
              this.AllRoles = response.data.map((role: any) => ({
                ...role,
                checked: false, // Add the 'checked' property with value 'false'
              }));
              this.totalPages = Math.ceil(this.AllRoles.length / 16);
              // this.sizeOfAllRoles=response.data.length;
              this.cdr.detectChanges();
              console.log('ALL ROLES:', this.AllRoles);
            }
          },
          error: (error: any) => {
            this.handleComponentError(error);
          },
        });
    }
  }
  // *************SORT FILTER ROLES*****************
  filterBySort(event: any) {
    console.log('SORT:', event);
    this.selectedSortBy = event.value;
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
      department: this.selectedDepartment,
      sortBy: this.selectedSortBy,
    };
    this.api
      .allRoles(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.AllRoles = response.data.map((role: any) => ({
              ...role,
              checked: false, // Add the 'checked' property with value 'false'
            }));
            this.totalPages = Math.ceil(this.AllRoles.length / 16);
            // this.sizeOfAllRoles=response.data.length;
            this.cdr.detectChanges();
            console.log('ALL ROLES:', this.AllRoles);
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }
  // *************GET DEPARTMNET **********
  getDepartmentDropDown() {
    this.api
      .getDepartmentsDropdown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.EvalutionFunctioList = response.data;
          this.cdr.detectChanges();
          console.log('BUSSINESS FUNCTION:', this.EvalutionFunctioList);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  // *********EMPLOYEES NAMES DROP DOWN************
  EmployeesDropDown() {
    let obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      organization: this.organizationName,
    };
    this.api
      .getEmployeesDropDown(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('EMPLOYEES NAMES:', response);
          this.employeesNames = response.data;
          this.filteredBanksMulti.next(response.data); // Initialize filtered data
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  // **************check box*************
  CheckAllOptions(event: any) {
    // console.log('CHECKBOX EVENT:', event);
    this.checkAll = true;
    const checkAll = this.AllRoles.every((val) => val.checked);
    this.AllRoles.forEach((val) => {
      val.checked = !checkAll;
    });
    // console.log(this.AllRoles, 'this.AllRoles');
  }
  checkBoxChange(event: any, data: any) {
    // console.log(event, data);
    data.checked = event.checked;
    // console.log(this.AllRoles, 'this.AllRoles');
  }

  bulkDelete() {
    this.deleteRole();
  }

  openBulkdeleteRoleDialog(templateRef: TemplateRef<any>) {
    this.AllRoles.forEach((val) => {
      if (val.checked === true) {
        const roles_ids = val.role_id;
        this.deleteRoleIds.push(roles_ids);
      }
    });
    this.dialog.open(templateRef, {
      width: '900px',
    });
  }

  // ************OPEN DELETE DIALOG*************
  openDialogDelete(templateRef: TemplateRef<any>, deleteroleDetails: any) {
    // console.log('DELETEROLEDIALOG:', deleteroleDetails);
    this.roleDetailsDelete = deleteroleDetails;
    this.deleteRoleIds.push(this.roleDetailsDelete.role_id);

    this.dialog.open(templateRef, {
      width: '900px',
    });
  }

  deleteRole() {
    let obj = {
      roleIdArray: this.deleteRoleIds,
    };
    this.api
      .deleteRoleById(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.dialog.closeAll();
            this.getAllRoles();
            this.checkAll = false;
            this.snackBar.open(response.message, 'x', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
              duration: 6000,
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
            duration: 6000,
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
        duration: 6000,
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
        duration: 6000,
      });
    } else {
      this.snackBar.open('An error occurred. Please try again later.', '×', {
        panelClass: ['custom-style'],
        verticalPosition: 'top',
        duration: 6000,
      });
    }
  }

  // ***************************JOB DESCRIPTION***************************
  openGenerateDialog(
    templateRef: TemplateRef<any>,
    roleDetailsJobGenerate: any
  ) {
    // *******************generate job description*******************
    console.log('roleDetailsJobGenerate', roleDetailsJobGenerate);
    this.roleGenerationData = roleDetailsJobGenerate;
    this.dialog.open(templateRef, {
      width: '1100px',
      panelClass: 'bg-color',
    });
    this.generateJobDescription();
  }

  generateJobDescription() {
    let obj = {
      roleId: this.roleGenerationData.role_id,
    };
    this.api
      .getJobDescription(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.generatedJobDescription = response.data[0].job_requirements;
            this.cdr.detectChanges();
            console.log('generateJobDescription', response.data);

            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            // Further operations with the response data can be performed here
          } else if (response.code === 400) {
            console.error(
              'API error generateJobDescription: Unexpected status code:',
              response.success
            );
            // Handle the error here, for example, display an error message
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
          // Handle the error here, for example, display an error message
        },
      });
  }

  createJobDescription() {
    let obj = {
      jobId: this.roleGenerationData.job_id,
    };

    this.api
      .generateJobCreateDescription(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.generatedJobDescription = response.data;
            this.cdr.detectChanges();
            console.log('createJobDescription', response.data);
          } else if (response.code === 400) {
            console.error(
              'API error createJobDescription: Unexpected status code:',
              response.success
            );
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  // ***********SAVE JOB DESCRIPTION***********
  saveJobDescription() {
    let obj = {
      roleId: this.roleGenerationData.role_id,
      jobDescription: this.generatedJobDescription,
    };
    this.api
      .updateJobDescription(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.dialog.closeAll();
            this.generatedJobDescription = '';
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            console.log('saveJobDescription', response);

            // Further operations with the response data can be performed here
          } else if (response.code === 400) {
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            console.error(
              'API error saveJobDescription: Unexpected status code:',
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
}
