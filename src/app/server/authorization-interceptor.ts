import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { LoadSpinnerService } from '../shared/load-spinner.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private loadSpinner: LoadSpinnerService
  ) {}
  env = environment;
  httpHeaders: HttpHeaders = new HttpHeaders();

  // intercept(
  //   httpRequest: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   const req = httpRequest.clone({
  //     headers: httpRequest.headers.set(
  //       'Authorization',
  //       'Bearer' + localStorage.getItem('TOKEN')?.toString() || ''
  //     ),
  //   });
  //   return next.handle(req);
  // }

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem('TOKEN');
    if (!jwt) {
      // No token, navigate to login screen
      this.router.navigate(['/login']);
      return next.handle(httpRequest); // Stop the request
    }
    this.loadSpinner.setLoading(true);

    const authRequest = httpRequest.clone({
      setHeaders: { Authorization: `Bearer ${jwt}` },
    });

    //
    return next.handle(authRequest).pipe(
      finalize(() => {
        setTimeout(() => {
          this.loadSpinner.setLoading(false);
        }, 2000);
      })
    );
  }
}
