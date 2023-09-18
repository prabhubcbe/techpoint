import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';

@Component({
  selector: 'app-employeeprofile',
  templateUrl: './employeeprofile.component.html',
  styleUrls: ['./employeeprofile.component.scss'],
  providers: [DatePipe],
})
export class EmployeeprofileComponent implements OnInit{
  @ViewChild('paginator') paginator: MatPaginator | undefined;
  employeeDetails: any = { user_id: '' };
  employeBio: any = {};
  employeeHighlights: any = {}
  suggestedTask: any = []
  employeeRoles: any[] = [];
  RolesDataList: any;
  filteredRolesDataList: any;
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  private ngUnsubscribe: Subject<void> = new Subject<void>();  
  pageEvent: PageEvent = new PageEvent();

  recommendJobs: any[] = [];
  userIdForProfile: any;
  matchDetails: any[] = [];
  gaugeType: NgxGaugeType = 'semi';
  gaugeValue = 70;
  guageSizethick = 27;
  gaugeAppendText = '%';
  blue = true;
  gaugecolor = '#2e585b';

  //Dialog properties
  MsgEntered: any='';
  messagesRecived: any;
  notesAdded: any;
  notesEntered: any;
  roleIdHandler: any;
  roleName: any;

  taskEntered: any;
  resourcesData: any;
  selecteResorce: any;
  dateActions: any;
  actionsData: any;
  candateDetails:any;
  statusLevel: any;
  constructor(
    // public routerActive: ActivatedRoute,
    // public snackBar: MatSnackBar,
    // private api: ServerService,
    // public route: Router,
    // private location: Location,
    // private cdr: ChangeDetectorRef,
    // public dialog: MatDialog

    private location: Location,
    public snackBar: MatSnackBar,
    public api: ServerService,
    public routerActive: ActivatedRoute,
    private datePipe: DatePipe,
    public route: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.employeeDetails.user_id = this.routerActive.snapshot.queryParams['userId'];
    this.userIdForProfile = this.routerActive.snapshot.queryParams['userId'];
    this.roleIdHandler = this.routerActive.snapshot.queryParams['roleId'];
    this.roleName = this.routerActive.snapshot.queryParams['roleName'];
    this.getEmployeeDetails();
    this.getuserProfile();
    this.getJobRecomendation();
    this.getHardSkill();
    this.getHighlights();
    this.getSuggestedTasks();
    this.getRoles();
    this.getAllRolesData();
    this.getResourcesDataList();
    this.getNotes();
    this.getActionsData();
    this.reciveMessages();    
  }
  getActionsData() {
    let obj = {
      userId: this.userIdForProfile,
      email: this.loginEmail,
      organization: this.organizationName,
    };
    this.api
      .getAction(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('actions:', response);
          this.actionsData = response.data;
        },
      });
  }
  onPopState() {
    this.location.back();
    console.log(this.location, 'location');
  }

  getEmployeeDetails() {
    let obj = {
      userId: this.employeeDetails.user_id,
      email: this.loginEmail,
      organization: this.organizationName,
      orgCode: this.organizationCode,
    };
    this.api
      .getUserById(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeeDetails = response.data;
          console.log('EMPLOYEE PROFILE', this.employeeDetails);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
    });
  }

  getHighlights() {
    let obj = {
      userId: this.employeeDetails.user_id,
    };
    this.api
      .getProfileIntelligence(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeeHighlights = response.data;
          console.log('HIGHLIGHTS:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getHardSkill() {
    let obj = {
      userId: this.employeeDetails.user_id,
    };
    this.api
      .getHardskillsById(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeBio = response.data;
          console.log('HARDSKILLS:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getRoles() {
    let obj = {
      userId: this.employeeDetails.user_id,
      email: this.loginEmail,
      organization: this.organizationName,
    };
    this.api
      .getRecommendedJobs(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.employeeRoles = response.data;
          console.log('ROLES:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getSuggestedTasks() {
    let obj = {
      userId: this.employeeDetails.user_id,
      email: this.loginEmail,
      organization: this.organizationName
    };
    this.api
      .getAction(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.suggestedTask = response.data;
          console.log('SUGGESTED TASKS:', response);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }
  getuserProfile() {
    let obj = {
      userId: this.userIdForProfile,
      email: this.loginEmail,
      organization: this.organizationName,
      orgCode: this.organizationCode,
      roleId: this.roleIdHandler,
    };
    this.api
      .getUserById(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.candateDetails = response.data;
          if (this.candateDetails?.stage_level === null) {
            this.statusLevel = 'null';
          } else {
            this.statusLevel = this.candateDetails?.stage_level;
          }
          console.log('CANDIADATE PROFILE', this.candateDetails);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }
  getJobRecomendation() {
    let obj = {
      email: this.loginEmail,
      organization: this.organizationName,
      userId: this.userIdForProfile,
    };
    this.api
      .getRecommendedJobs(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('jobRecommendations:', response);
          this.recommendJobs = response.data;
          this.matchDetails[0] = response.data[0];
          console.log("matchDetails###");
          console.log(this.matchDetails[0]);
          // this.matchDetails.push(response.data[0]);
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
      
  }
  sendRoleMatch(event: any) {
    console.log(event);
    this.matchDetails[0] = event;
    console.log(this.matchDetails, 'matchDetails');
    console.log(this.recommendJobs);
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
  formatDate(date: any) {
    const formattedDate = this.datePipe.transform(date, 'MMM d');
    return formattedDate || ''; // Return an empty string if formatting fails
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
addMessageDialog(templateRef:TemplateRef<any>){
  this.dialog.open(templateRef, {
    width: '1000px',
    height: 'auto',
    panelClass: 'custom-dialog-container'
  })
}
saveMessage() {
  let obj = {
    email: this.loginEmail,
    organization: this.organizationName,
    userIdArray: [this.userIdForProfile], // ARRAY OF USER ID
    message: this.MsgEntered,
    orgCode: this.organizationCode,
  };
  this.api
    .sendMessages(obj)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response: any) => {
        console.log('NOTES ADDED:', response);
        if (response.code === 200) {
          this.reciveMessages();
          this.MsgEntered = '';
          this.dialog.closeAll();
          this.snackBar.open(response.message, '×', {
            panelClass: ['custom-style'],
            verticalPosition: 'top',
            duration: 3000,
          });
        }
      },
      error: (error: any) => {
        this.handleComponentError(error);
      },
    });
}

saveNotes() {
  let obj = {
    email: this.loginEmail,
    organization: this.organizationName,
    userIdArray: [this.userIdForProfile], // ARRAY OF USER ID
    notes: this.notesEntered,
  };
  this.api
    .addNotes(obj)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response: any) => {
        console.log('NOTES ADDED:', response);
        if (response.code === 200) {
          this.getNotes();
          this.notesEntered = '';
          this.dialog.closeAll();
          this.snackBar.open(response.message, '×', {
            panelClass: ['custom-style'],
            verticalPosition: 'top',
            duration: 3000,
          });
        }
      },
      error: (error: any) => {
        this.handleComponentError(error);
      },
    });
}
reciveMessages() {
  let obj = {
    email: this.loginEmail,
    organization: this.organizationName,
    userId: this.userIdForProfile, // ARRAY OF USER ID
  };
  this.api
    .getMessages(obj)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response: any) => {
        this.messagesRecived = response.data;
      },
      error: (error: any) => {
        this.handleComponentError(error);
      },
    });
    console.log("GETMESSAGE###");
    console.log(JSON.stringify(this.messagesRecived));
}
addMsgDilaog(templateRef: TemplateRef<any>) {
  this.dialog.open(templateRef, {
    width: '1000px',
    height: 'auto',
    panelClass: 'custom-dialog-container',
  });
}
getResourcesDataList() {
  this.api
    .getResourcesInAction()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      console.log('stages', response);
      this.resourcesData = response.data;
      console.log("Resource List ###");
      console.log(this.resourcesData);
    });
}
getNotes() {
  let obj = {
    userId: this.userIdForProfile,
    email: this.loginEmail,
    organization: this.organizationName,
  };
  this.api
    .getNotesForUser(obj)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response: any) => {
        console.log('NOTES:', response);
        this.notesAdded = response.data;
        if (response.code === 400) {
          // this.snackBar.open(' Notes arent added', '×', {
          //   panelClass: ['custom-style'],
          //   verticalPosition: 'top',
          //   duration: 3000,
          // });
        }
      },
      error: (error: any) => {
        this.handleComponentError(error);
      },
    });
}
addNotesDilaog(templateRef: TemplateRef<any>) {
  this.dialog.open(templateRef, {
    width: '1000px',
    height: 'auto',
    panelClass: 'custom-dialog-container',
  });
}
addTaskDilaog(templateRef: TemplateRef<any>) {
  this.dialog.open(templateRef, {
    width: '1000px',
    height: 'auto',
    panelClass: 'custom-dialog-container',
  });
}
savetask() {
  let obj = {
    email: this.loginEmail,
    organization: this.organizationName,
    userIdArray: [this.userIdForProfile], // ARRAY OF USER ID
    dueDate: this.dateActions,
    type: this.selecteResorce,
    taskDesc: this.taskEntered,
  };
  this.api
    .saveAction(obj)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response: any) => {
        console.log('NOTES ADDED:', response);
        if (response.code === 200) {
          this.dialog.closeAll();
          this.snackBar.open(response.message, '×', {
            panelClass: ['custom-style'],
            verticalPosition: 'top',
            duration: 3000,
          });
          this.taskEntered='';
          this.getActionsData();
        }
      },
      error: (error: any) => {
        this.handleComponentError(error);
      },
    });    
}
  ngOnDestroy(): void {
    console.log('employee profile component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
