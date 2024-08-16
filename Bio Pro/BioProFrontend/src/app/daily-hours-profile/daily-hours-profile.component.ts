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
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedMonth: number | null = null;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.updateWeekDays(this.selectedDate);
    this.fetchData();
  }

  updateWeekDays(selectedDate: Date): void {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  
    this.weekDays = [];
    let currentDate = startOfWeek;
    while (currentDate <= endOfWeek) {
      this.weekDays.push({ 
        label: formatDate(currentDate, 'EEEE, MMMM d, yyyy', 'en-US'), // Assuming this format for label
        date: new Date(currentDate)
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
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
    if (this.selectedDate) {
      // Only proceed if selectedDate is not null
      const dateToFilter = this.selectedDate;
      this.filteredDailyHours = this.dailyHoursData.filter(dailyHour => {
        const workDate = new Date(dailyHour.workDate);
        return formatDate(workDate, 'yyyy-MM-dd', 'en-US') === formatDate(dateToFilter, 'yyyy-MM-dd', 'en-US');
      });
    } else {
      // Handle case when selectedDate is null, if needed
      this.filteredDailyHours = this.dailyHoursData;
    }
  }
  

  onDateChange(event: any): void {
    this.selectedDate = event.value ? new Date(event.value) : new Date();
    this.filterDataBySelectedDate();
  }
  
  
  onMonthChange(event: any): void {
    this.selectedMonth = event.value ? parseInt(event.value, 10) : null;
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