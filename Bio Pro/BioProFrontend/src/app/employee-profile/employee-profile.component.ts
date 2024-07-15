import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';
import { EditEmployeeDialogComponent } from '../edit-employee-dialog/edit-employee-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteEmployeeComponent } from '../confirm-delete-employee/confirm-delete-employee.component';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  employees: any[] = [];
  searchQuery = '';
  jobTitles: any[] = [];
  noResultsFound = false;

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchAllEmployees();
    this.getJobTitles();
  }

  fetchAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(data => {
      this.employees = data;
      this.noResultsFound = this.employees.length === 0;
    });
  }

  searchEmployees() {
    this.employeeService.searchEmployees(this.searchQuery).subscribe(data => {
      this.employees = data;
      this.noResultsFound = this.employees.length === 0;
    });
  }

  editEmployee(employee: any) {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      width: '400px',
      data: { ...employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchAllEmployees();
        this.snackBar.open('Employee updated successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  deleteEmployee(employee: any) {
    if (!employee.employeeId) {
      console.error('EmployeeId is undefined. Cannot delete employee.');
      return;
    }
  
    const dialogRef = this.dialog.open(ConfirmDeleteEmployeeComponent, {
      width: '400px',
      data: { employee }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(employee.employeeId).subscribe(() => {
          this.fetchAllEmployees(); // Refresh the list after deleting
        }, error => {
          console.error('Error deleting employee:', error);
        });
      }
    });
  }

  getJobTitles() {
    this.employeeService.getJobtitles().subscribe(data => {
      this.jobTitles = data;
    });
  }

  onOrderIdChange(searchCriteria: string) {
    if (searchCriteria.trim() === '') {
      this.fetchAllEmployees();
    } else {
      this.employees = this.employees.filter((d) => {
        let fullName = (d.firstName + ' ' + d.lastName).toLowerCase();
        return d.email.toLowerCase().includes(searchCriteria) ||
               d.firstName.toLowerCase().includes(searchCriteria) ||
               d.lastName.toLowerCase().includes(searchCriteria) ||
               fullName.includes(searchCriteria);
      });
      this.noResultsFound = this.employees.length === 0;
    }
  }
}
