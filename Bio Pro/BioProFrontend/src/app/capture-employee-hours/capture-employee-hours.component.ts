import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DailyHours } from '../shared/dailyhours';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-capture-employee-hours',
  templateUrl: './capture-employee-hours.component.html',
  styleUrls: ['./capture-employee-hours.component.scss']
})
export class CaptureEmployeeHoursComponent implements OnInit {
  employees: any[] = []; // Assuming employees are fetched from the service
  captureHoursForm: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.captureHoursForm = this.fb.group({
      employee: [null, Validators.required],
      workDate: [new Date().toISOString().split('T')[0], Validators.required], // Initialize with current date
      clockInTime: ['', Validators.required],
      clockOutTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(
      employees => {
        this.employees = employees;
      },
      error => {
        this.openSnackBar('Failed to fetch employees');
        console.error(error);
      }
    );
  }

  submitForm(): void {
    if (this.captureHoursForm.invalid) {
      this.openSnackBar('Form is invalid');
      console.error('Form is invalid');
      return;
    }

    const formValues = this.captureHoursForm.value;
    const dailyHours: DailyHours = {
      EmployeeId: formValues.employee,
      WorkDate: formValues.workDate,
      Hours: this.calculateHoursWorked(formValues.clockInTime, formValues.clockOutTime)
    };

    // Send daily hours to backend
    this.employeeService.captureEmployeeDailyHours(formValues.employee, dailyHours).subscribe(
      response => {
        console.log(response);
        this.openSnackBar('Employee hours captured successfully');
      },
      error => {
        console.error(error);
        this.openSnackBar('Failed to capture employee hours');
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

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Duration in milliseconds
    });
  }
}
