// add-employee.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Employee } from '../shared/employee';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeAtt: Employee = {
    userId: 0,
    jobTitleId: null,
    firstName: '',
    lastName: '',
    cellphoneNumber: '',
    email: '',
    address: ''
  };

  jobTitles = [
    { id: 1, title: 'Admin' },
    { id: 2, title: 'Dental Technician' },
    { id: 3, title: 'Lab Manager' },
    { id: 4, title: 'Delivery' }
  ];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  addEmployee() {
    this.dataService.addEmployee(this.addEmployeeAtt).subscribe({
      next: (employee) => {
        this.router.navigate(['employees']);
        console.log(employee);
      }
    });
  }

  cancel() {
    this.router.navigate(['employees']);
  }
}
