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
    
    JobTitleId: 0,
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
      this.addEmployeeAtt=form.value
      console.log(this.addEmployeeAtt)
      this.dataService.addEmployee(this.addEmployeeAtt).subscribe({
        next: (employee: Employee) => {
          this.snackBar.open(`Employee added successfully`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'] // Optional: custom CSS class for styling
          });
          this.router.navigate(['employees']);
        },
        error: (error: HttpErrorResponse) => {
          error: (error: HttpErrorResponse) => {
            let errorMessage = 'Error adding employee';
            if (error.error && typeof error.error === 'object') { // Check if it's an object
              errorMessage = error.error.message || 'Unknown error'; // Access specific property or default message
            } else {
              // Handle other error types (e.g., network errors)
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
            }
            this.snackBar.open(errorMessage, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        }
      });
    }
  }
  

  cancel() {
    this.router.navigate(['/employeeProfile']);
  }
}
