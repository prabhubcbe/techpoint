import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('input1') input1: ElementRef | any;
  @ViewChild('input2') input2: ElementRef | any;
  @ViewChild('input3') input3: ElementRef | any;
  @ViewChild('input4') input4: ElementRef | any;
  @ViewChild('input5') input5: ElementRef | any;
  @ViewChild('input6') input6: ElementRef | any;

  hide = true;
  qrCodeImg: any;
  twoStep: boolean | undefined;
  encryptSecretKey = 'mayamaya1234@H';
  hideSiginDetails = true;
  qrCodeDetails: boolean | undefined;
  userEmail: any;
  organizationData: any;
  code: any;
  dataFromParent: any;
  emailSignInBtn: any;
  passwordSignInBtn: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    // public snackBar: MatSnackBar,
    public authApi: AuthserviceService,
    private cdr: ChangeDetectorRef,
    private router: Router // private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}
  // *******************************SHOW PASSWORD INPUT TYPED*******************************************************
  myFunction() {
    this.hide = !this.hide;
  }

  // *******************************LOGIN*******************************************************
  onSubmit(login: any) {
    console.log(login, 'obj signin');
    this.emailSignInBtn = login.email;
    this.passwordSignInBtn = login.password;
    let obj = {
      email: this.emailSignInBtn,
      password: this.passwordSignInBtn,
    };

    this.authApi
      .loginApi(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            console.log('loginResponse', response);
            this.hideSiginDetails = !this.hideSiginDetails;

            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error recentActivities: Unexpected status code:',
              response.data.statusCode
            );
            // Handle the error here, for example, display an error message
          }
        },
        error: (error: any) => {
          console.error('API error:', error);
          // Handle the error here, for example, display an error message
        },
      });

    // console.log(obj, 'obj signin');
    // this.api.userLogin(obj).subscribe((data: any) => {
    //   console.log(data.data);
    //   this.organizationData = data.data.org_names;
    //   if (data.data.statusCode === 200) {
    //     this.userEmail = obj.email;
    //     localStorage.setItem('org_names', data.data.org_names);
    //     console.log(data.data.org_names, 'org_names');
    //     this.hideSiginDetails = !this.hideSiginDetails;
    //     // if (!data.data?.org_names.length) {
    //     //   console.log(this.userEmail, 'userEmailsavedtoobj');
    //     // } else {
    //     //   console.log('an external user');
    //     //   // alert(data.data.data);
    //     // }
    //   } else {
    //     this.snackBar.open(data.data.data, '×', {
    //       panelClass: ['custom-style'],
    //       verticalPosition: 'top',
    //       duration: 3000,
    //     });
    //   }
    // });
  }
  // *******************************TWO STEP AUTH*******************************************************
  twoStepCodeSubmit(twoStepCodeForm: {
    input1: any;
    input2: any;
    input3: any;
    input4: any;
    input5: any;
    input6: any;
  }) {
    // this.spinner.show();
    let obj = {
      email: this.emailSignInBtn,
      otp:
        twoStepCodeForm.input1 +
        twoStepCodeForm.input2 +
        twoStepCodeForm.input3 +
        twoStepCodeForm.input4 +
        twoStepCodeForm.input5 +
        twoStepCodeForm.input6,
    };
    console.log(obj, 'mail otp obj');
    this.authApi
      .otpVerification(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log(response, 'otp verify');
          if (response.code == 200) {
            localStorage.setItem('TOKEN', response.data.token);
            localStorage.setItem(
              'organization',
              response.data.organizations[0].organization
            );
            localStorage.setItem(
              'org-code',
              response.data.organizations[0].orgCode
            );
            localStorage.setItem('loginEmail', response.data.email);
            this.router.navigate(['/home']);
          }
        },
        error: (error: any) => {
          alert(`API error:${error.error.errors.otp.msg}`);
          // console.log('API ERROR:', error);
          // console.log('API ERROR:', error.error.errors.otp.msg);
          // Handle the error here, for example, display an error message
        },
      });
    // this.api.codeVerify(obj).subscribe((response: any) => {
    //   console.log(response, 'data');
    //   this.spinner.hide();
    //   if (response.data.statusCode === 200) {
    //     // this.router.navigate(['/console']);
    //     this.router.navigate(['/home']);
    //     let emailEncrypt = CryptoJS.AES.encrypt(
    //       obj.email,
    //       this.encryptSecretKey
    //     ).toString();
    //     localStorage.setItem('useremail', emailEncrypt);
    //     console.log(response.data);
    //   } else {
    //     this.input1.nativeElement.value = '';
    //     this.input2.nativeElement.value = '';
    //     this.input3.nativeElement.value = '';
    //     this.input4.nativeElement.value = '';
    //     this.input5.nativeElement.value = '';
    //     this.input6.nativeElement.value = '';
    //     this.snackBar.open(response.data.message, '×', {
    //       panelClass: ['custom-style'],
    //       verticalPosition: 'top',
    //       duration: 3000,
    //     });
    //   }
    // });
  }

  resendonSubmit() {
    // this.spinner.show();
    this.input1.nativeElement.value = '';
    this.input2.nativeElement.value = '';
    this.input3.nativeElement.value = '';
    this.input4.nativeElement.value = '';
    this.input5.nativeElement.value = '';
    this.input6.nativeElement.value = '';
    // // this.input1.focus();
    let obj = {
      email: this.emailSignInBtn,
      password: this.passwordSignInBtn,
    };

    this.authApi
      .loginApi(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            console.log('loginResponse', response);

            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error recentActivities: Unexpected status code:',
              response.data.statusCode
            );
            // Handle the error here, for example, display an error message
          }
        },
        error: (error: any) => {
          console.error('API error:', error);
          // Handle the error here, for example, display an error message
        },
      });
    // console.log(obj, 'resend obj');
    // this.api.userLogin(obj).subscribe((data: any) => {
    //   this.spinner.hide();
    //   console.log(data, 'resend otp');
    // });
  }
}
