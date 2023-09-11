import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent implements OnInit {
  hideAuthCode = false;
  showrePassword = false;
  EmailInput = true;
  emailForgotPassword: any;
  dataFromEmail: any;
  password: any;
  rePassword: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public authApi: AuthserviceService,
    public snackBar: MatSnackBar,
    public route: Router
  ) {} // public apiV2: ServerVersion2Service // private router: Router, // public api: ServerService, //

  ngOnInit(): void {}

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

  // *******************************FORGET PASSWORD*******************************************************
  getOtpEmail(data: any) {
    console.log(data, 'data');
    this.emailForgotPassword = data.email;
    let obj = {
      email: data.email,
    };

    this.authApi
      .forgotPassword(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('FORGOT PASSWORD:', response);
          if (response.code === 200) {
            this.hideAuthCode = true;
            this.EmailInput = false;
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });

    // this.apiV2.getOtpForgotPassword(obj).subscribe((data: any) => {
    //   this.dataFromEmail = data.data;
    //   console.log(this.dataFromEmail, 'dataFromEmail');
    //   console.log(data, 'data');
    //   if (data.data.status === 200) {
    //     this.snackBar.open(data.data.message, 'Close', {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //       horizontalPosition: 'right',
    //     });

    //   } else {
    //     this.snackBar.open(data.data.message, 'Close', {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //       horizontalPosition: 'right',
    //     });
    //   }
    // });
  }

  verifyOtp(data: any) {
    console.log(data, 'data');
    let obj = {
      email: this.emailForgotPassword,
      otp:
        data.value.input1 +
        data.value.input2 +
        data.value.input3 +
        data.value.input4 +
        data.value.input5 +
        data.value.input6,
    };

    this.authApi
      .otpVerification(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('FORGOT PASSWORD:', response);
          if (response.code === 200) {
            this.hideAuthCode = false;
            this.EmailInput = false;
            this.showrePassword = true;
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });

    // this.api.codeVerify(obj).subscribe((data: any) => {
    //   console.log(data, 'data');
    //   if (data.data.statusCode === 200) {
    //     this.snackBar.open(data.data.data, 'Close', {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //       horizontalPosition: 'right',
    //     });
    //     this.hideAuthCode = false;
    //     this.EmailInput = false;
    //     this.showrePassword = true;
    //   } else {
    //     this.snackBar.open(data.data.data, 'Close', {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //       horizontalPosition: 'right',
    //     });
    //   }
    // });
  }

  resetPassword() {
    let obj = {
      email: this.emailForgotPassword,
      password: this.rePassword,
    };

    this.authApi
      .resetPassword(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('FORGOT PASSWORD:', response);
          if (response.code === 200) {
            localStorage.clear();
            this.route.navigate(['/login']);
            this.snackBar.open(response.message, 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          }
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
    // console.log(obj, 'obj');
    // this.apiV2.resetPassword(obj).subscribe((data: any) => {
    //   console.log(data, 'data');
    //   if (data.data.status === 200) {
    //     this.snackBar.open(data.data.message, 'Close', {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //       horizontalPosition: 'right',
    //     });
    //     this.dataFromEmail = '';
    //     this.router.navigate(['/loginV2']);
    //   } else {
    //     this.snackBar.open(data.data.message, 'Close', {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //       horizontalPosition: 'right',
    //     });
    //   }
    // });
  }
}
