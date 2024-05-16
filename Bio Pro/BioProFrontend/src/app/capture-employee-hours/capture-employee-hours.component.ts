import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DailyHours } from '../shared/dailyhours';
import { Employee } from '../shared/employee';

@Component({
  selector: 'app-capture-employee-hours',
  templateUrl: './capture-employee-hours.component.html',
  styleUrls: ['./capture-employee-hours.component.scss']
})
export class CaptureEmployeeHoursComponent implements OnInit {
  selectedEmployeeId: number | null = null; // Track selected employee ID
  workDate: Date = new Date(); // Initialize with current date
  clockInTime: string = ''; // Initialize with empty string
  clockOutTime: string = ''; // Initialize with empty string
  employees: any[] = []; // Assuming employees are fetched from the service

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  submitForm(): void {
    if (!this.selectedEmployeeId) {
      console.error('No employee selected');
      return;
    }

    const dailyHours: DailyHours = {
      EmployeeId: this.selectedEmployeeId,
      WorkDate: this.workDate,
      Hours: this.calculateHoursWorked(this.clockInTime, this.clockOutTime)
    };

    // Send daily hours to backend
    this.employeeService.captureEmployeeDailyHours(this.selectedEmployeeId,dailyHours).subscribe(
     response => {
       console.log(response);
         // Handle success response here
      },
       error => {
        console.error(error);
        // Handle error response here
      }
    );
  }

  calculateHoursWorked(clockInTime: string, clockOutTime: string): number {
    const [clockInHour, clockInMinute] = clockInTime.split(':').map(Number);
    const [clockOutHour, clockOutMinute] = clockOutTime.split(':').map(Number);

    const totalMinutesClockIn = clockInHour * 60 + clockInMinute;
    const totalMinutesClockOut = clockOutHour * 60 + clockOutMinute;

    const differenceInMinutes = Math.abs(totalMinutesClockOut - totalMinutesClockIn);
    const hoursWorked = differenceInMinutes / 60;

    return hoursWorked;
  }
}

