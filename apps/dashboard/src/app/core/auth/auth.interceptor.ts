import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Intercept the HTTP request
 * Set the current user id in the x-user-id header. It's used for basic authentication
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Clone the request object
  let newReq = req.clone();

  // Set the auth user id in x-user-id request header
  //
  if (authService.currentUser) {
    newReq = req.clone({
      headers: req.headers.set('x-user-id', `${authService.currentUser?.id}`),
    });
  }

  // Response
  return next(newReq).pipe(
    catchError((error) => {
      // Catch "401 Unauthorized" responses
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Sign out
        authService.signOut();

        // Reload the app
        location.reload();
      }

      return throwError(error);
    })
  );
};
