import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';

@Component({
  selector: 'app-daily-hours-profile',
  templateUrl: './daily-hours-profile.component.html',
  styleUrls: ['./daily-hours-profile.component.scss']
})
export class DailyHoursProfileComponent implements OnInit {
  dailyHours: DailyHours[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.getDailyHours();
  }

  getDailyHours() {
    this.employeeService.getEmployeeDailyHours().subscribe(result => {
      this.dailyHours = result;
      console.log(result);
    }, error => {
      console.log(error);
    });
  }

  deleteEmployeeDailyHours(id: number) {
    this.employeeService.deleteEmployeeDailyHours(id).subscribe(result => {
      console.log(result);
      this.getDailyHours(); // Refresh the list after deletion
    }, error => {
      console.log(error);
    });
  }
}
