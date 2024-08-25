import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../shared/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
import { PhoneChecker } from '../validators/Validators';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  jobTitles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private router: Router ,
    private loginService:DataService
  ) {
    this.employeeForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      JobTitleId: ['', Validators.required],
      EmailAddress: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required,PhoneChecker.SouthAfricanPhoneNumberValidator()]],
      Address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getJobtitles();
  }

  jobtitles: any[] = [];

  getJobtitles() {
    this.employeeService.getJobtitles().subscribe(results => {
      this.jobtitles = results;
      console.log(this.jobtitles);
    },
    error => {
      console.log(error);
    });
  }

  addEmployee() {
    if (this.employeeForm.valid) {
      const newEmployee: Employee = this.employeeForm.value as Employee;

      console.log('Employee added:', newEmployee);
      this.employeeService.addEmployee(newEmployee).subscribe({
        next: (employee: Employee) => {
          this.snackBar.open('Employee added successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Navigate to the desired route after successful submission
          this.loginService.addTransaction("Post","User created employee:"+newEmployee.EmailAddress)
          this.router.navigate(['/employee']); // Example: Navigate to the employees list
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Error adding employee';
          if (error.error && typeof error.error === 'object') {
            errorMessage = error.error.message || 'Unknown error';
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  cancel() {
    // Navigate to the desired route when the cancel button is clicked
    this.router.navigate(['/employeeProfile']); // Example: Navigate to the employees list
  }
}
