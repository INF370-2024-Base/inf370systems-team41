// employee-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Employee } from '../shared/employee';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  employees: any[] = [];
  searchQuery = '';

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.fetchAllEmployees();
    
  }

  fetchAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(data => {
      this.employees = data;
      console.log(this.employees);
    });
  }

  searchEmployees() {
    this.employeeService.searchEmployees(this.searchQuery).subscribe(data => {
      this.employees = data;
    });
  }

  editEmployee(employee: Employee) {
    // Implement the logic to navigate to the edit employee form
  }

  deleteEmployee(employee: Employee) {
  //   this.employeeService.deleteEmployee(employee.id).subscribe(() => {
  //     const index = this.employees.indexOf(employee);
  //     if (index > -1) {
  //       this.employees.splice(index, 1);
  //     }
  //   });
   }
}
