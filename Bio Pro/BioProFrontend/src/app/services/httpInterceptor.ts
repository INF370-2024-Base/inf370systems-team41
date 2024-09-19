import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar,private route:Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different types of HTTP errors here
        if (error.status === 0) {
          // Network error or no response from the server
          this.snackBar.open('Network error. Please check your connection.', 'Dismiss', {
            duration: 5000,
          });
        }
         else if (error.status == 403) {
          // Client-side error
          this.snackBar.open('Not authorized to access this action.', 'Dismiss', {
            duration: 5000,
          });
          this.route.navigate(["unauthorized"])
        }
        else if (error.status >= 500) {
          // Server-side error
          this.snackBar.open('Server error occurred. Please contact admin.', 'Dismiss', {
            duration: 5000,
          });
        }
        // Re-throw the error so it can be handled by the caller if needed
        throw error;
      })
    );
  }
}
