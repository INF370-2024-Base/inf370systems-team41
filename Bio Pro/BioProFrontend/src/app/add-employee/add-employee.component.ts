// add-employee.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; // Import NgForm
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Employee } from '../shared/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from '../services/employee.service';
import { error } from 'console';

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

  jobTitles:any=[]

  constructor(
    private dataService: DataService,
    private employeeService:EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }
  ngOnInit(): void {
    this.getJobtitles()
  }
getJobtitles()
  {
  this.employeeService.getJobtitles().subscribe(results=>{
  this.jobTitles=results
  console.log(this.jobTitles)
    }
  ,
  (error)=>{
    console.log(error)
    }
  )
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
    this.router.navigate(['/employeeProfile']);
  }
}
