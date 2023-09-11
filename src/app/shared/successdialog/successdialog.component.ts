import {
  Component,
  Inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-successdialog',
  templateUrl: './successdialog.component.html',
  styleUrls: ['./successdialog.component.scss'],
})
export class SuccessdialogComponent implements OnInit {
  @Input() message: string | undefined;
  @Input() notes: string | undefined;
  shared: any;

  // notes: any;

  // notes: any;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.message = this.data;
  }
  ngOnInit(): void {
    this.shared = this.data;

    this.message = this.shared[0].message;
    this.notes = this.shared[0].note;

    console.log(this.shared, 'shared');
  }

  closedialog() {
    this.dialog.closeAll();
  }
}
