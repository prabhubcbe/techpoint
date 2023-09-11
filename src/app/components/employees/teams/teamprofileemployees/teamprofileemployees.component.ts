import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';

@Component({
  selector: 'app-teamprofileemployees',
  templateUrl: './teamprofileemployees.component.html',
  styleUrls: ['./teamprofileemployees.component.scss'],
})
export class TeamprofileemployeesComponent {
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  allEmployeesData: any;
  bubbleChartData: any[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  divbox: any;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 24,
    navSpeed: 700,
    navText: [
      ' <i class="fa-solid fa-arrow-left"></i>',

      '<i class="fa-solid fa-arrow-right"></i>',
    ],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      1366: {
        items: 4,
      },
    },
    nav: true,
  };

  constructor(public api: ServerService, private cdr: ChangeDetectorRef, private http: HttpClient) {
    this.getAllEmployeesData();
  }

  // ******************
  getData(e: any) {
    //alert(e.target);
    this.divbox = !this.divbox;
    return this.setData(e);
  }

  setData(e: any) {}

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

  ngOnDestroy(): void {
    console.log('applicants component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
