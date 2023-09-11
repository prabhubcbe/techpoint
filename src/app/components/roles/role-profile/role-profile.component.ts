import { MatDialog } from '@angular/material/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-role-profile',
  templateUrl: './role-profile.component.html',
  styleUrls: ['./role-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleProfileComponent implements OnInit, DoCheck, OnDestroy {
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  @ViewChild('inputValue', { static: false })
  inputValue!: ElementRef<HTMLInputElement>;
  fruits: Fruit[] = [];
  sliderValues: { value: number; category: string }[] = [];
  FilterpanelIsOpen = false;
  pageEvent: PageEvent = new PageEvent();
  allEmployeesData: any[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  getRoleID: any;
  getRoleName: any;
  getJobId: any;
  pageIndex = 1;
  pageSize = 21;
  skillValues: any;
  descriptionGenerated: any;
  generatedJobDescription: any;
  disableSlider = true;
  hideAdjust = true;
  department: any;
  level: any;
  description: any;
  // slectedEmployees: any[] = [];

  bankMultiCtrl = new FormControl();
  public bankMultiFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredBanksMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  employeesNames: any;
  protected _onDestroy = new Subject<void>();
  roleCompleteDetails: any;
  rolesQuestions: any;
  // ***********slider roles
  max = 10;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  genderDataList: any;
  ethnicityDataList: any;
  considerationDatalIst: any;
  SkillSliderDialog: any;
  EvalutionFunctioList: any;
  totalCountCandidates: any;
  departmentSlected: any;
  regionDataList: any;
  searchText: any;

  // ***********FilterVALUE**********
  selectedGender = '';
  selectedEthnicity = '';
  selectedConsideration = '';
  selectedRegion = '';
  selectedEducation = '';
  selectedHardskill = '';
  hardSkillsDataList: any;

  // *******OPENING DIALOG
  @ViewChild('editDialog', { static: true })
  editDialog!: TemplateRef<any>;
  editable: any;
  favFilledIcon = false;

  constructor(
    private location: Location,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public api: ServerService,
    public route: Router,
    private routeActive: ActivatedRoute,
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) {}
  ngDoCheck(): void {
    // console.log('component rendered');
  }

  searchPanelIsOpen = false;
  // countNum = signal(0);
  // increase = 0;
  ngOnInit(): void {
    this.getRoleID = this.routeActive.snapshot.queryParams['role_id'];
    this.getroleData();
    // this.getRoleName = this.routeActive.snapshot.queryParams['role_name'];
    // this.getJobId = this.routeActive.snapshot.queryParams['job_id'];
    console.log('ROLEID:', this.getRoleID);
    this.editable = this.routeActive.snapshot.queryParams['editable'];

    this.createRolesQuestions();
    this.getAllEmployeesData();
    // console.clear();
    // Listen for search field value changes employees drop down
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });
    setTimeout(() => {
      if (this.editable === 'edit') {
        this.editDilaogOPen(this.editDialog);
      }
    }, 2000);

    console.log('roles profile component rendered');
  }

  getGenderDataList() {
    this.api
      .getGenderDropDown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.genderDataList = response.data;
          console.log(response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getConsiderationDataList() {
    this.api
      .getConsidirationsDropDown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.considerationDatalIst = response.data;
          console.log(response);
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

  getRegionDataList() {
    this.api
      .getRegionDropDown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.regionDataList = response.data;
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getHardSkillDataList() {
    this.api
      .getHardSkillsDropDown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.hardSkillsDataList = response.data;
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

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
  getEthnicityDataList() {
    this.api
      .getEthnicityDropDown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.ethnicityDataList = response.data;
          console.log(response);
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

  openGenerateDialog(templateRef: TemplateRef<any>) {
    // *******************generate job description*******************

    this.dialog.open(templateRef, {
      width: '1100px',
      panelClass: 'bg-color',
    });
    this.generateJobDescription();
  }

  // ***********EDIT DIALOG *************
  editDilaogOPen(templateRef: TemplateRef<any>) {
    console.log(this.roleCompleteDetails, 'roleCompleteDetails');
    this.dialog.open(templateRef, {
      width: '1100px',
      // height: '600px',
      panelClass: 'bg-color',
    });

    if (this.roleCompleteDetails.user_details) {
      this.EmployeesDropDown();
      this.editable = false;
      // this.getAllEmployeesData();
    }
    // Assuming newValue is defined somewhere in your component
    let newValue = 'notEditable';
    this.routeActive.queryParams.subscribe((params: any) => {
      const currentParams = { ...params }; // Create a copy of the current parameters
      currentParams.editable = newValue; // Update the editable parameter

      this.route.navigate([], {
        relativeTo: this.routeActive,
        queryParams: currentParams, // Set the updated parameters
        queryParamsHandling: 'merge', // Merge with existing query parameters
      });
    });
  }

  createJobDescription() {
    let obj = {
      jobId: this.getJobId,
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

  generateJobDescription() {
    let obj = {
      roleId: this.getRoleID,
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

  openSuccessDialog() {
    this.dialog.closeAll();
  }

  // ******************Duplicate ROLE******************
  duplicateRole() {
    let obj = {
      roleId: this.getRoleID,
    };
    this.api
      .createduplicateRole(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            console.log('duplicateRole', response.data);

            // Further operations with the response data can be performed here
          } else if (response.code === 400) {
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            console.error(
              'API error duplicateRole: Unexpected status code:',
              response.success
            );
            // Handle the error here, for example, display an error message
          }
        },
      });
  }

  // *************************Hide and show filter options*************************
  toggleFilter() {
    this.FilterpanelIsOpen = !this.FilterpanelIsOpen;
    this.searchPanelIsOpen = false;
    this.getEthnicityDataList();
    this.getGenderDataList();
    this.getConsiderationDataList();
    this.getDepartmentDropDown();
    this.getRegionDataList();
    this.getHardSkillDataList();
    this.cdr.detectChanges();
  }
  toggleSearch() {
    this.searchPanelIsOpen = !this.searchPanelIsOpen;
    this.FilterpanelIsOpen = false;
    this.cdr.detectChanges();
  }

  getuserresultsViewAll(event: any) {
    console.log(event, 'event');
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getAllEmployeesData();
  }

  async getAllEmployeesData() {
    this.favFilledIcon = false;
    const obj = {
      email: this.loginEmail,
      orgCode: this.organizationCode,
      roleId: this.getRoleID,
      // organization: this.organizationName,
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    console.log(obj, 'obj');
    this.api
      .getMatchedResultsForRole(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            console.log('getAllEmployeesData', this.allEmployeesData);
            this.allEmployeesData = response.data;
            this.totalCountCandidates = response.total_count;
            // Manually trigger change detection
            this.cdr.detectChanges();
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
          // Handle the error here, for example, display an error message
        },
      });
  }

  // **********RESULT CARD***********
  routeCandidate(data: any) {
    // console.log(data);
    this.route.navigate(['/candidates/Candidatesprofile'], {
      queryParams: {
        userId: data.user_id,
        roleId: this.getRoleID,
        roleName: this.getRoleName,
      },
    });
  }

  addFav(data: any) {
    console.log(data, 'data');
    let obj = {
      roleId: this.getRoleID,
      userIdArray: [data.user_id],
    };
    this.api
      .favCandidateToRole(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            // this.getroleData();
            this.getAllEmployeesData();
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
              duration: 3000,
            });
          } else if (response.code === 400) {
            this.handleComponentError(response.msg);
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  removeFav(data: any) {
    console.log(data, 'data');
    let obj = {
      roleId: this.getRoleID,
      userIdArray: [data.user_id],
    };
    this.api
      .unFavCandidateToRole(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            // this.getroleData();
            this.getAllEmployeesData();
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
              duration: 3000,
            });
          } else if (response.code === 400) {
            this.handleComponentError(response.msg);
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getroleData() {
    this.api
      .rolesById(this.getRoleID)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          // Manually trigger change detection
          this.roleCompleteDetails = response.data;
          // console.clear();
          console.log('ROLE ID RESPONSE:', this.roleCompleteDetails);
          // this.bankMultiCtrl.setValue([response.data.user_details[0].user_id]);
          // console.log(this.bankMultiCtrl, 'this.bankMultiCtrl');
          // this.slectedEmployees = this.roleCompleteDetails.user_details;
          this.getRoleName = response.data.role_name;
          this.getJobId = response.data.job_id;
          this.skillValues = response.data.skill_values;
          this.department = response.data.department;
          this.level = response.data.level;
          this.description = response.data.description;
          this.cdr.detectChanges();
          console.log(
            this.getRoleName,
            this.getJobId,
            this.department,
            this.level,
            this.description,
            'roledetails'
          );

          this.skillValues.forEach((element: any) => {
            element.value = element.value / 2;
          });
          console.log(this.skillValues, 'skillValues');
          console.log(this.getRoleName, this.getJobId, 'roledetails');
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          // console.log('ERROR:', error);
          this.handleComponentError(error);
        },
      });
  }

  // ***********SAVE JOB DESCRIPTION***********
  saveJobDescription() {
    let obj = {
      roleId: this.getRoleID,
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
            console.log('saveJobDescription', response.data);

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

  editSliders() {
    this.disableSlider = false;
    this.hideAdjust = !this.hideAdjust;
  }

  updatesSliders() {
    this.hideAdjust = !this.hideAdjust;
    this.skillValues.forEach((element: any) => {
      element.value = element.value * 2;
    });
    let obj = {
      roleId: this.getRoleID,
      roleName: this.getRoleName,
      department: this.department,
      level: this.level,
      description: this.description,
      roleValues: this.skillValues,
    };
    console.log(obj, 'obj');
    this.api
      .updatesSlider(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log(response, 'response');
          if (response.code === 200) {
            this.getroleData();
            this.getAllEmployeesData();
            this.sliderValues.forEach((element: any) => {
              element.value = element.value / 2;
            });
            this.disableSlider = true;
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            console.log('updatesSliders', response.data);

            // Further operations with the response data can be performed here
          } else if (response.code === 400) {
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            console.error(
              'API error updatesSliders: Unexpected status code:',
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

  ngOnDestroy(): void {
    console.log('role profile component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  setSliderValue(event: number, index: any) {
    console.log(event, index, 'event');
    if (!this.skillValues[index]) {
      this.skillValues.push({
        value: event,
        category: this.skillValues[index].category,
      });
      console.log(this.skillValues, 'skillValues');
    } else {
      this.skillValues[index].value = event;
      console.log(this.skillValues, 'skillValues');
    }
  }

  // ***********Dialog close************
  closeDialogEmployee() {
    // this.slectedEmployees = [];
    this.dialog.closeAll();
  }

  // ***************CREATING ROLE USING EMPLOYEES*************
  createNewRoleEmployee(templateRef: TemplateRef<any>) {
    // this.employeeRoleBtn = true;
    // this.scratchRoleBtn = false;
    console.log('addRoleBasedOnEmployee');
    this.dialog.open(templateRef, {
      width: '900px',
      // height: '450px',
      panelClass: 'bg-color',
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

          let selectedRoles = this.roleCompleteDetails.user_details.map(
            (item: any) => item.user_id
          );
          this.bankMultiCtrl.setValue(selectedRoles);

          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  onPopState() {
    this.location.back();
    console.log(this.location, 'location');
  }

  // **********EDIT ROLE USING QUESTIONs***********
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

  // *********SLIDER VALUES***************
  getSliderValue(index: number): number {
    // console.log(this.sliderValues);
    // console.log('rolesQuestions:', this.roleCompleteDetails.skill_values);
    this.SkillSliderDialog = this.roleCompleteDetails.role_values;
    if (this.SkillSliderDialog[index]) {
      // console.log('getSliderValue:', this.SkillSliderDialog[index].value);
      return this.SkillSliderDialog[index].value;
    }
    return 0; // Default value if not set
  }

  setSliderValueDialog(newValue: number, index: number): void {
    if (!this.SkillSliderDialog[index]) {
      this.SkillSliderDialog[index] = {
        value: 0,
        category: this.rolesQuestions[index].category,
      };
    }
    this.SkillSliderDialog[index].value = newValue;
    console.log(this.SkillSliderDialog, 'SkillSliderDialog');
  }

  updatesSlidersDialog() {
    let obj;

    if (this.roleCompleteDetails.user_details) {
      obj = {
        roleId: this.getRoleID,
        roleName: this.getRoleName,
        department: this.department,
        level: this.level,
        description: this.description,
        userIdArray: this.bankMultiCtrl.value,
      };
    } else {
      obj = {
        roleId: this.getRoleID,
        roleName: this.getRoleName,
        department: this.department,
        level: this.level,
        description: this.description,
        roleValues: this.SkillSliderDialog,
      };
    }

    console.log(obj, 'obj');

    this.api
      .updatesSlider(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log(response, 'response');
          if (response.code === 200) {
            this.getroleData();
            this.getAllEmployeesData();
            this.dialog.closeAll();
            this.SkillSliderDialog = [];

            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });

            console.log('updatesSliders', response.data);

            // Further operations with the response data can be performed here
          } else if (response.code === 400) {
            this.snackBar.open(response.message, '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            console.error(
              'API error updatesSliders: Unexpected status code:',
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

  editDialogClose() {
    this.dialog.closeAll();
    this.getroleData();
  }
  removeLastChip(): void {
    if (this.inputValue.nativeElement.value === '' && this.fruits.length > 0) {
      this.fruits.pop();
    }
    console.log(this.fruits, 'this.fruitsremoveLastChip');
  }

  // *****************INPUT CHIPS*****************
  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    console.log(this.fruits, 'this.fruits remove');
  }

  add(newFruit: string): void {
    if (newFruit && newFruit.trim() !== '') {
      this.fruits.push({ name: newFruit.trim() });
    }
    console.log(this.fruits, 'this.fruits add');
  }

  // *************get shortlisted data**********
  getShortListed() {
    this.favFilledIcon = true;
    let obj = {
      roleId: this.getRoleID,
      email: this.loginEmail,
      organization: this.organizationName,
      orgCode: this.organizationCode,
    };
    this.api
      .shortListedCandidatesInRole(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            this.allEmployeesData = res.data;
            this.totalCountCandidates = res.data.length;
            this.cdr.detectChanges();
          } else {
            this.snackBar.open('something went wrong', '×', {
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

  // *************FILTER VALUES *************
  applyFilters() {
    let obj = {
      roleId: this.getRoleID,
      email: this.loginEmail,
      orgCode: this.organizationCode,
      gender: this.selectedGender,
      ethnicity: this.selectedEthnicity,
      specialConsideration: this.selectedConsideration,
      region: this.selectedRegion,
    };

    this.api
      .filterByRoleId(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            console.log(response, 'response');
            this.allEmployeesData = response.data;
            this.totalCountCandidates = response.data.length;
            this.cdr.detectChanges();
          } else if (response.code === 400) {
            this.snackBar.open('NO data found', '×', {
              panelClass: ['custom-style'],
              verticalPosition: 'top',
            });
            this.selectedGender = '';
            this.selectedEthnicity = '';
            this.selectedConsideration = '';
            this.selectedRegion = '';
            this.selectedEducation = '';
            this.selectedHardskill = '';
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  resetFilters() {
    this.selectedGender = '';
    this.selectedEthnicity = '';
    this.selectedConsideration = '';
    this.selectedRegion = '';
    this.selectedEducation = '';
    this.selectedHardskill = '';
    this.getAllEmployeesData();
  }
}
