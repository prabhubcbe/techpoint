import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public route: Router) {}
  routeIndividuals() {
    this.route.navigate(['/employees/IndividualComponent']);
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }
}
