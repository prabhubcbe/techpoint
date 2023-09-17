import { Component } from '@angular/core';
import { LoadSpinnerService } from '../load-spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  constructor(public loader: LoadSpinnerService) {}
}
