import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor() {}

  isLoggedIn() {
    return !!localStorage.getItem('TOKEN');
  }
}
