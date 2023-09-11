import { inject, ɵɵinject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  // Use dependency injection to get an instance of the AuthService
  const authService = ɵɵinject(AuthGuardService);

  // Check if the user is logged in using the AuthService
  if (authService.isLoggedIn()) {
    return true; // If logged in, allow access to the route
  } else {
    inject(Router).navigate(['/login']);
    return false; // If not logged in, deny access to the route
  }
};
