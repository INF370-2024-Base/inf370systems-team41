import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDeleteDailyHourComponent } from '../confirm-delete-daily-hour/confirm-delete-daily-hour.component';
import { formatDate } from '@angular/common';
import { CaptureEmployeeHoursComponent } from '../capture-employee-hours/capture-employee-hours.component';

@Component({
  selector: 'app-daily-hours-profile',
  templateUrl: './daily-hours-profile.component.html',
  styleUrls: ['./daily-hours-profile.component.scss']
})
export class DailyHoursProfileComponent implements OnInit {
  dailyHours: DailyHours[] = [];
  employees: any[] = [];
  isLoading: boolean = true;
  dailyHoursData: any[] = [];
  filteredDailyHours: any[] = []; // To hold the filtered data
  selectedDate: Date = new Date();
  filterEmployeeName: string = '';
  selectedEmployeeEmail: string = '';
  displayedColumns: string[] = ['date', 'hours', 'employee', 'action'];
  weekDays: { label: string, date: Date }[] = [];
  selectedMonth: number | null = null;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.updateWeekDays(this.selectedDate);
    this.fetchData();
  }

  updateWeekDays(date: Date): void {
    const startOfWeek = this.getStartOfWeek(date);
    this.weekDays = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return {
        label: formatDate(day, 'EEEE', 'en-US'), // "EEEE" for the full name of the day
        date: day
      };
    });
    this.filterDataBySelectedDate(); // Filter data whenever the week days are updated
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  fetchData(): void {
    this.isLoading = true;

    this.employeeService.getEmployeeDailyHours().subscribe(
      (results) => {
        this.dailyHoursData = results;
        this.filterDataBySelectedDate(); // Filter data after fetching it
        this.employeeService.getAllEmployees().subscribe(
          (results) => {
            this.employees = results;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching employees:', error);
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching daily hours:', error);
        this.isLoading = false;
      }
    );
  }

  getEmployeeName(email: string): string {
    const employee = this.employees.find(e => e.email === email);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  }
  

  filterDataBySelectedDate(): void {
    // Filter the dailyHoursData to only include entries that match the selected date
    this.filteredDailyHours = this.dailyHoursData.filter(dailyHour => {
      const matchesDate = formatDate(dailyHour.workDate, 'yyyy-MM-dd', 'en-US') === formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
      const matchesMonth = this.selectedMonth ? (new Date(dailyHour.workDate).getMonth() + 1) === this.selectedMonth : true;
      return matchesDate && matchesMonth;
    });
  }


  onDateChange(event: any): void {
    const newDate = event.target.value ? new Date(event.target.value) : new Date();
    this.selectedDate = newDate;
    this.updateWeekDays(newDate);
  }

  onMonthChange(event: any): void {
    this.selectedMonth = event.target.value ? parseInt(event.target.value, 10) : null;
    this.filterDataBySelectedDate();
  }

  onTabChange(index: number): void {
    this.selectedDate = this.weekDays[index].date;
    this.filterDataBySelectedDate(); // Re-filter the data based on the new selected date
  }

  clearData(): void {
    this.selectedDate = new Date();
    this.selectedMonth = null;
    this.updateWeekDays(this.selectedDate);
    this.selectedEmployeeEmail = '';
    this.fetchData();
  }

  onNameChange(event: any): void {
    this.selectedEmployeeEmail = event.value;
    this.filteredDailyHours = this.dailyHoursData.filter(dailyHour =>
      dailyHour.employees.some((employee: any) => employee.email === this.selectedEmployeeEmail)
    );
    this.selectedMonth = null; // Reset month selection when filtering by employee
    this.selectedDate = new Date(); // Reset date selection
  }
  

  onDeleteDailyHour(dailyHourId: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDailyHourComponent, {
      width: '400px',
      data: { dailyHourId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployeeDailyHours(dailyHourId).subscribe(
          () => {
            console.log(`Successfully deleted daily hour with ID: ${dailyHourId}`);
            this.fetchData(); // Refresh the list of daily hours after deletion
          },
          (error) => {
            console.error('Error deleting daily hour:', error);
          }
        );
      }
    });
  }

  captureEmployeeHours(): void {
    const dialogRef = this.dialog.open(CaptureEmployeeHoursComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData(); // Refresh data after capturing new hours
      }
    });
  }
}