import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
// import { NgxGauge } from 'ngx-gauge';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerService } from 'src/app/server/server.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Y } from '@angular/cdk/keycodes';
import { LoadSpinnerService } from 'src/app/shared/load-spinner.service';

@Component({
  selector: 'app-candidatesprofile',
  templateUrl: './candidatesprofile.component.html',
  styleUrls: ['./candidatesprofile.component.scss'],
  providers: [DatePipe],
})
export class CandidatesprofileComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator | undefined;
  pageEvent: PageEvent = new PageEvent();
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  guageValue1 = ' 70%';
  gaugeType: NgxGaugeType = 'semi';
  gaugeValue = 70;
  guageSizethick = 27;
  gaugeAppendText = '%';
  blue = true;

  gaugecolor = '#2e585b';
  view: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  userIdForProfile: any;
  candateDetails: any;
  recommendJobs: any[] = [];
  educatioDetails: any;
  hardSkills: any;
  Bio: any;
  experienceDetails: any;
  highlights: any;
  roleIdHandler: any;
  // editStageFlag = true;

  roleName: any;
  notesAdded: any;
  notesEntered: any;
  messagesRecived: any;
  stageDataList: any;
  statusLevel: any;
  MsgEntered: any;
  resourcesData: any;
  selecteResorce: any;
  dateActions: any;
  taskEntered: any;
  matchDetails: any[] = [];
  actionsData: any;
  constructor(
    private location: Location,
    public snackBar: MatSnackBar,
    public api: ServerService,
    public routerActive: ActivatedRoute,
    private datePipe: DatePipe,
    public route: Router,
    private loadSpinner: LoadSpinnerService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.userIdForProfile = this.routerActive.snapshot.queryParams['userId'];
    this.roleIdHandler = this.routerActive.snapshot.queryParams['roleId'];
    this.roleName = this.routerActive.snapshot.queryParams['roleName'];
    this.getuserProfile();
    this.getJobRecomendation();
    this.getHardSkill();
    this.getHightLights();
    this.getNotes();
    this.reciveMessages();
    this.getStagesDataList();
    this.getResourcesDataList();
    this.getActionsData();
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

  formatDate(date: any) {
    const formattedDate = this.datePipe.transform(date, 'MMM d');
    return formattedDate || ''; // Return an empty string if formatting fails
  }

  ngOnDestroy(): void {
    console.log('home component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  onPopState() {
    this.location.back();
    console.log(this.location, 'location');
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

  getStagesDataList() {
    this.api
      .getStageLevelDropDown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        console.log('stages', response);
        this.stageDataList = response.data;
      });
  }

  getResourcesDataList() {
    this.api
      .getResourcesInAction()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        console.log('stages', response);
        this.resourcesData = response.data;
        // this.cdr.detectChanges();
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

  updateStage() {
    this.loadSpinner.setLoading(true);
    let obj = {
      userIdArray: [this.userIdForProfile],
      stageLevel: this.statusLevel,
    };
    this.api
      .setStageLevel(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          // this.editStageFlag = true;
          this.loadSpinner.setLoading(false);
          this.snackBar.open(response.message, '×', {
            panelClass: ['custom-style'],
            verticalPosition: 'top',
            duration: 3000,
          });
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
  // editStage() {
  //   this.editStageFlag = false;
  // }
  getHardSkill() {
    let obj = {
      userId: this.userIdForProfile,
    };
    this.api
      .getHardskillsById(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('HARDSKILLS:', response);
          this.educatioDetails = response.data.education;
          this.Bio = response.data.summary;
          this.experienceDetails = response.data.experience;
          // REMOVING THE EMPTY OBJECTS FROM THE ARRAY
          this.hardSkills = response.data?.skills?.filter(
            (skill: string) => skill !== ''
          );
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  getHightLights() {
    let obj = {
      userId: this.userIdForProfile,
    };
    this.api
      .getProfileIntelligence(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          console.log('HIGHTLIGHTS:', response);
          this.highlights = response.data.profile_intelligence;
        },
        error: (error: any) => {
          this.handleComponentError(error);
        },
      });
  }

  addFav() {
    let obj = {
      roleId: this.roleIdHandler,
      userIdArray: [this.userIdForProfile],
    };
    this.api
      .favCandidateToRole(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            // this.getroleData();
            this.getuserProfile();

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

  removeFav() {
    let obj = {
      roleId: this.roleIdHandler,
      userId: this.userIdForProfile,
    };
    this.api
      .unFavCandidateToRole(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.getuserProfile();
            // this.getroleData();
            // this.getAllEmployeesData();
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

  addMsgDilaog(templateRef: TemplateRef<any>) {
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
            this.getActionsData();
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

   // **********************SHOW DISABLED MESSAGES**********
   showDisabled() {
    this.snackBar.open('This feature is coming soon..', '×', {
      panelClass: ['custom-style'],
      verticalPosition: 'top',
    });
  }
}
