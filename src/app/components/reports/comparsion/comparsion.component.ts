import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';

@Component({
  selector: 'app-comparsion',
  templateUrl: './comparsion.component.html',
  styleUrls: ['./comparsion.component.scss'],
})
export class ComparsionComponent {
  evaluation_DropdwonForm = new FormControl([]); // Form control for evaluation dropdown selection
  guageValue1 = ' 70%';
  gaugeType: NgxGaugeType = 'semi';
  gaugeValue = 70;
  guageSizethick = 27;
  gaugeAppendText = '%';

  gaugecolor = '#2e585b';
  evaluvation_datalist = [
    // Array of evaluation options
    {
      id: 1,
      name: 'All Time',
    },
    {
      id: 2,
      name: 'Team member',
    },
    {
      id: 3,
      name: 'Software develop',
    },
  ];
  onRemoveEvalvationDropdown() {
    this.evaluation_DropdwonForm.setValue([]); // Clear the selected evaluation options
  }
}
