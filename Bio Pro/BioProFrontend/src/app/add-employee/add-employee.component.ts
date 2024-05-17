// add-employee.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; // Import NgForm
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Employee } from '../shared/employee';
import { MatSnackBar } from '@angular/material/snack-bar';

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
        error: (error: any) => {
          this.snackBar.open(`Error adding employee: ${error.message}`, 'Close', {
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
