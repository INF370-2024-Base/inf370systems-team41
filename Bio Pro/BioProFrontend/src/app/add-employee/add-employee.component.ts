// add-employee.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; // Import NgForm
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Employee } from '../shared/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeAtt: Employee = {
    
    JobTitleId: null,
    EmailAddress: '',
    PhoneNumber: '',
    Address: ''
  };

  jobTitles = [
    { id: 1, title: 'Admin' },
    { id: 2, title: 'Dental Technician' },
    { id: 3, title: 'Lab Manager' },
    { id: 4, title: 'Delivery' }
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }
  ngOnInit(): void {
  }

  addEmployee(form: NgForm) {
    if (form.valid) {
      this.dataService.addEmployee(this.addEmployeeAtt).subscribe({
        next: (employee: Employee) => {
          this.snackBar.open(`Employee added successfully`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'] // Optional: custom CSS class for styling
          });
          this.router.navigate(['employees']);
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Error adding employee';
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            // so we check for known error messages.
            if (error.error.includes('Employee already exists')) {
              errorMessage = 'Error: Employee already exists';
            } else if (error.error.includes('JobTitle not found')) {
              errorMessage = 'Error: JobTitle not found';
            } else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
            }
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'] // Optional: custom CSS class for styling
          });
        }
      });
    }
  }
  

  cancel() {
    this.router.navigate(['employees']);
  }
}
