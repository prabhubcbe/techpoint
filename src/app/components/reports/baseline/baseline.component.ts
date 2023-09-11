import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-baseline',
  templateUrl: './baseline.component.html',
  styleUrls: ['./baseline.component.scss'],
})
export class BaselineComponent {
  isFirstButtonActive: boolean = true;
  roles_onfirst = false;
  roles_onSecond = true;

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  showRolesBaseline() {
    this.roles_onfirst = !this.roles_onfirst;
    this.roles_onSecond = !this.roles_onSecond;
  }

  // ************************* 1st Table ******************************
  toggleButtons() {
    this.isFirstButtonActive = !this.isFirstButtonActive;
  }
}
