import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthserviceService } from '../authservice.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  encryptSecretKey = 'mayamaya1234@H';
  // dataxlsx: AOA = [[], []];

  // dataxlsxEmployee: AOA;
  orgCode: any;

  // *************
  @ViewChild('organizationInfo', { static: true })
  organizationInfo: TemplateRef<any> | undefined;
  images: any;
  execelFile: any;
  adminEmailOnSignUp: string | undefined;
  FileNameEmployees: any;
  finalArrEmployee = [];
  admin_email = localStorage.getItem('admin_email');
  ConsoleUsers: any;
  adminuserUploaded = [];
  organizationInfoList: any;
  organizationName: any;
  organizationIndustry: any;
  organizationNaicscode: any;
  organizationCountry: any;
  organizationState: any;
  organizationCity: any;
  orgCodeShow: string | undefined;
  countriesListOrg: any;
  statesListOrg: any;
  doneUpload = true;
  IndustryValues: any;
  payloadEmailConsoleUsers = [];

  // *************form validation*************
  formName = false;

  constructor(
    public authApi: AuthserviceService,
    public snackBar: MatSnackBar,
    public router: Router,
    private spinner: NgxSpinnerService
  ) {}
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  // public snackBar: MatSnackBar // public api2: ServiceAdminsettingService, // public api: ServerService, // public dialog: MatDialog, // private router: Router, // public apiV2: ServerVersion2Service,

  ngOnInit(): void {
    this.getContriesOrg();
    this.getIndustry();
    // this.openDocDialogWithTemplateReforganizationInfo(this.organizationInfo);
  }

  ngOnDestroy(): void {
    console.log('destroyed Component signup');
    console.log('home component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    // localStorage.removeItem('admin_email');
  }
  getContriesOrg() {
    // this.api2.getCountries().subscribe((res: any) => {
    //   this.countriesListOrg = res.data;
    //   console.log(this.countriesListOrg, 'countriesListOrg');
    // });
  }

  getStateFromCountries(country: any) {
    // console.log(country, 'country');
    // let obj = {
    //   country: country,
    // };
    // this.api2.getStates(obj).subscribe((res: any) => {
    //   this.statesListOrg = res.data;
    //   // console.log(this.statesListOrg, 'organizationState');
    // });
  }

  getIndustry() {
    // this.api2.getIndustryForAdmins().subscribe((res: any) => {
    //   this.IndustryValues = res.data;
    //   // console.log(this.IndustryValues, 'IndustryValues');
    // });
  }

  openDocDialogWithTemplateReforganizationInfo(templateRef: TemplateRef<any>) {
    // this.dialog.open(templateRef, {
    //   width: '1600px',
    //   panelClass: 'bg-color',
    // });
  }
  open() {
    window.open('/assets/file/soft.pdf');
  }

  // ******************GLOBAL ERROR HANDLING FUNCTION******************
  handleComponentError(error: any) {
    if (error.status === 400 && error.error && error.error.errors) {
      for (const key in error.error.errors) {
        if (error.error.errors.hasOwnProperty(key)) {
          const dynamicError = error.error.errors[key];
          this.snackBar.open(dynamicError.msg, '×', {
            panelClass: ['custom-style'],
            verticalPosition: 'top',
            duration: 3000,
          });
          console.log(dynamicError.value);
          console.log(dynamicError.msg);
        }
      }
    } else {
      this.snackBar.open('An error occurred. Please try again later.', '×', {
        panelClass: ['custom-style'],
        verticalPosition: 'top',
        duration: 3000,
      });
    }
  }
  signUp(data: NgForm) {
    this.spinner.show();

    // **************FORM IS INVALID**************
    if (data.invalid) {
      console.log('invalid form');
      this.formName = true;

      this.snackBar.open('fill the required fileds', '×', {
        panelClass: ['custom-style'],
        verticalPosition: 'top',
        duration: 3000,
      });
    }
    // **************FORM IS VALID**************
    if (data.valid) {
      console.log('valid form');
      this.formName = false;
      console.log(data, 'data');

      //
      let signUpOnObj = {
        adminEmail: data.value.email,
        adminName: data.value.name,
        adminOrg: data.value.firmName,
        firmWebsite: data.value.firmWebsite,
        adminPhone: data.value.number,
      };
      console.log(signUpOnObj, 'signupobj');

      // **************SIGNUP API**************
      this.authApi
        .signUp(signUpOnObj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (response: any) => {
            if (response.code === 200) {
              this.spinner.hide();
              this.snackBar.open('Signup Successfull', '×', {
                panelClass: ['custom-style'],
                verticalPosition: 'top',
                duration: 3000,
              });
              localStorage.setItem('TOKEN', response.data.access_token);
              this.router.navigate(['/home']);
            }
            console.log(response, 'response');
          },
          // **************ERROR HANDLING**************
          error: (error: any) => {
            console.error('API error:', error);
            this.handleComponentError(error);
            // Handle the error here, for example, display an error message
            // if (error.status === 400 && error.error && error.error.errors) {
            //   for (const key in error.error.errors) {
            //     if (error.error.errors.hasOwnProperty(key)) {
            //       const dynamicError = error.error.errors[key];
            //       this.snackBar.open(dynamicError.msg, '×', {
            //         panelClass: ['custom-style'],
            //         verticalPosition: 'top',
            //         duration: 3000,
            //       });
            //       console.log(dynamicError.value); // This will output the invalid value
            //       console.log(dynamicError.msg); // This will output the error message
            //       // You can handle the error here as needed
            //     }
            //   }
            // }
          },
        });
    }

    // this.api.signUp(signUpOnObj).pipe(takeUntil(this.ngUnsubscribe))
    // .subscribe({
    //   next: (response: any) => {
    //     console.log(response, 'response');
    //   }
    // },
    // error: (error: any) => {
    //   console.log(error, 'error');
    //   if (error.status === 400 && error.error && error.error.errors) {
    //     for (const key in error.error.errors) {
    //       if (error.error.errors.hasOwnProperty(key)) {
    //         const dynamicError = error.error.errors[key];
    //         console.log(dynamicError.value); // This will output the invalid value
    //         console.log(dynamicError.msg); // This will output the error message
    //         // You can handle the error here as needed
    //       }
    //     }
    //   }
    // });

    // this.api.signUp(signUpOnObj).subscribe(
    //   (res: any) => {
    //     console.log(res, 'res');
    //     if (res.data.statusCode == 200) {
    //       console.log(res, 'res 200');
    //     }
    //   },
    //   (error) => {
    //     console.log(error, 'error');
    //     if (error.status === 400 && error.error && error.error.errors) {
    //       for (const key in error.error.errors) {
    //         if (error.error.errors.hasOwnProperty(key)) {
    //           const dynamicError = error.error.errors[key];
    //           console.log(dynamicError.value); // This will output the invalid value
    //           console.log(dynamicError.msg); // This will output the error message
    //           // You can handle the error here as needed
    //         }
    //       }
    //     }
    //   }
    // );

    // // if(data.SoftwareServicesAgreement = )
    // // console.log(data, 'dataform');
    // let obj = {
    //   admin_name: data.value.name,
    //   admin_email: data.value.email,
    //   admin_org: data.value.firmName,
    //   admin_firm: data.value.firmWebsite,
    //   admin_phone: data.value.number,
    // };
    // // console.log('obj', obj);
    // this.apiV2.signUpInAbout(obj).subscribe(
    //   (res: any) => {
    //     if (res.data.statusCode == 200) {
    //       this.orgCode = res.data.data.org_code;
    //       // this.admin_email = data.value.email;
    //       localStorage.setItem('admin_email', data.value.email);
    //       // console.log(this.admin_email, 'admin_email');
    //       // this.router.navigate([
    //       //     '/orgCodeComponent',
    //       //     { org_code: this.orgCode },
    //       //   ]);
    //       this.openDocDialogWithTemplateReforganizationInfo(
    //         this.organizationInfo
    //       );
    //       this.getOrganizationInfoList();
    //       localStorage.setItem('orgCode', this.orgCode);

    //       this.router.navigate(['/orgCodeComponent']);
    //       console.log('orgCode', this.orgCode);
    //       let emailEncrypt = CryptoJS.AES.encrypt(
    //         res.data.data.email,
    //         this.encryptSecretKey
    //       ).toString();
    //       localStorage.setItem('useremail', emailEncrypt);
    //       localStorage.setItem('org_names', res.data.data.organization);

    //       data.reset();
    //     } else if (res.data.statusCode == 400) {
    //       alert(res.data.data);
    //     }
    //     console.log('res', res.data);
    //   },
    //   (error: HttpErrorResponse) => {
    //     console.log(error);
    //     alert(error.error.data);
    //   }
    // );
  }

  // ******ORGANIZATION SETTINGS******************

  uploadExcelFile() {
    // this.doneUpload = false;
    // this.payloadEmailConsoleUsers = [];
    // this.adminuserUploaded = [];
    // // this.hideExecelUpload = true;
    // const formData = new FormData();
    // // formData.append('admin_email', this.admin_email);
    // formData.append('user_file', this.execelFile);
    // this.adminEmailOnSignUp = localStorage.getItem('useremail');
    // console.log(this.adminEmailOnSignUp, 'adminEmailOnSignUp');
    // formData.append('admin_email', localStorage.getItem('admin_email'));
    // if (this.execelFile?.size > 10) {
    //   this.api2.uploadExecel(formData).subscribe((response: any) => {
    //     this.adminuserUploaded = response.data;
    //     console.log(this.adminuserUploaded, '<<<<<uploadExcelFile>>>>');
    //     for (let i = 0; i < this.adminuserUploaded.length; i++) {
    //       this.payloadEmailConsoleUsers.push({
    //         user_id: this.adminuserUploaded[i].Email,
    //         user_name: this.adminuserUploaded[i].Name,
    //       });
    //     }
    //     console.log(this.payloadEmailConsoleUsers, 'payloadEmailConsoleUsers');
    //     // this.getadmindata();
    //   });
    // }
  }
  getOrganizationInfoList() {
    // console.log(this.admin_email, 'admin_email');
    // let obj = {
    //   admin_email: localStorage.getItem('admin_email'),
    // };
    // this.api2.getOrganization(obj).subscribe((response: any) => {
    //   this.organizationInfoList = response.data;
    //   this.organizationName = response.data[0].org_name;
    //   this.organizationIndustry = response.data[0].industry;
    //   this.organizationNaicscode = response.data[0].naics_code;
    //   this.organizationCountry = response.data[0].country;
    //   this.organizationState = response.data[0].state;
    //   this.organizationCity = response.data[0].city;
    //   console.log(response, '<<<<<<<getOrganizationInfoList>>>>');
    // });
  }

  onSelectExecel(event: any) {
    // console.log(event, 'execel select');
    // if (event.target.files.length > 0) {
    //   const file = event.target.files[0];
    //   this.execelFile = file;
    // }
  }

  onFileChangeEmployee(evt: any) {
    // console.log(evt, 'evnt');
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

  // excel upload
  excelUploadEmployee() {
    // this.doneUpload = false;
    // let headers = this.dataxlsxEmployee[0];
    // let data = this.dataxlsxEmployee.slice(1);
    // for (let i = 0; i < data.length; i++) {
    //   let obj = {};
    //   for (let j = 0; j < headers.length; j++) {
    //     obj[headers[j]] = data[i][j];
    //   }
    //   this.finalArrEmployee.push(obj);
    // }
    // console.log(this.finalArrEmployee, 'finalArrEmployee');
  }
  // sending email to both console users and onboard employees
  sendOnBoardEmployee() {
    // // this.spinner.show();
    // let employeeDetails = [];
    // for (let i = 0; i < this.finalArrEmployee.length; i++) {
    //   employeeDetails.push({
    //     name: this.finalArrEmployee[i].Name,
    //     email: this.finalArrEmployee[i].Email,
    //   });
    // }
    // let obj = {
    //   login_email: localStorage.getItem('admin_email'),
    //   employee_details: employeeDetails,
    //   // job_id: this.selectedjob_id,
    // };
    // console.log(obj, '<<<<<<<sendOnBoardEmployee>>>>');
    // this.api.sendEmailtoEmployee(obj).subscribe((responseAppUser: any) => {
    //   console.log(responseAppUser, 'responseAppUser');
    //   let objConsoleUsers = {
    //     login_email: localStorage.getItem('admin_email'),
    //     user_data: this.payloadEmailConsoleUsers,
    //   };
    //   this.api
    //     .sendEmailConsoleUsers(objConsoleUsers)
    //     .subscribe((responseConsole: any) => {
    //       console.log(responseConsole, 'response console users');
    //     });
    //   this.snackBar.open('Email Sent Successfully', '×', {
    //     panelClass: ['custom-style'],
    //     verticalPosition: 'top',
    //     duration: 3000,
    //   });
    // });
  }

  onSelectImage(eventImg: any) {
    // console.log(eventImg, '<<<<<<<eventImg>>>>');
    // if (eventImg.target.files.length > 0) {
    //   const file = eventImg.target.files[0];
    //   this.images = file;
    // }
  }

  editSaveOrganization(updateOrgForm: any) {
    // console.log(updateOrgForm, '<<<<<<<updateOrgForm>>>>');
    // const formData = new FormData();
    // formData.append('file', this.images || '');
    // formData.append('admin_email', localStorage.getItem('admin_email'));
    // formData.append('org_name', updateOrgForm.org_name || '');
    // formData.append('industry', updateOrgForm.industry || '');
    // formData.append('address', updateOrgForm.address || '');
    // formData.append('city', updateOrgForm.city || '');
    // formData.append('state', updateOrgForm.state || '');
    // formData.append('zipcode', updateOrgForm.zipcode || '');
    // formData.append('country', updateOrgForm.country || '');
    // formData.append('naics_code', updateOrgForm.naics_code || '');
    // formData.append('description', updateOrgForm.description || '');
    // // console.log(this.images, '<<<<<<<obj organization>>>>');
    // this.api2.updateOrganization(formData).subscribe((response: any) => {
    //   // console.log(response, '<<<<<<<editSaveOrganization>>>>');
    //   // this.getOrganizationInfoList();
    // });
  }

  DoneInStep2() {
    // this.orgCodeShow = localStorage.getItem('orgCode');
  }

  skipStep2() {
    // this.dialog.closeAll();
  }
}
