import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';
import { ConfirmDeleteDailyHourComponent } from '../confirm-delete-daily-hour/confirm-delete-daily-hour.component';
import { DataService } from '../services/login.service';
import { formatDate } from '@angular/common';
import { RoleGuardService } from '../services/roleCheck';                             
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
  filteredDailyHours: any[] = []; // Filtered data
  selectedDate: Date = new Date(); // Initialize to today's date
  selectedIndex: number = 0; // For tab navigation
  filterEmployeeName: string = '';
  selectedEmployeeEmail: string = '';
  displayedColumns: string[] = ['date', 'hours', 'employee', 'action'];
  weekDays: { label: string, date: Date }[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedMonth: number | null = null;
  filterApplied: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private loginService: DataService,
    private cdr: ChangeDetectorRef,
    private roleGuardService: RoleGuardService,
  ) {}
  isOwner(): boolean {
    const expectedRoles = ['Owner'];  // Define the roles to check
    return this.roleGuardService.hasRole(expectedRoles);
  }

  ngOnInit(): void {
    this.updateWeekDays(this.selectedDate);
    this.fetchData();
    this.selectTabForDate(this.selectedDate); // Ensure the correct tab is selected on init
  }

  updateWeekDays(selectedDate: Date): void {
    // Generate a week of days centered around the selected date
    this.weekDays = [];
    for (let i = -3; i <= 3; i++) {
      const currentDate = new Date(selectedDate);
      currentDate.setDate(selectedDate.getDate() + i);
      this.weekDays.push({
        label: formatDate(currentDate, 'EEEE, MMMM d, yyyy', 'en-US'),
        date: currentDate
      });
    }
    this.cdr.detectChanges();
  }

  trackByDate(index: number, day: { date: Date }): string {
    return day.date.toISOString();
  }

  fetchData(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeDailyHours().subscribe(
      (results) => {
        this.dailyHoursData = results;
        this.filterDataBySelectedDate();
        this.employeeService.getAllEmployees().subscribe(
          (employees) => {
            this.employees = employees;
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
    this.filteredDailyHours = this.dailyHoursData.filter(dailyHour => {
      const workDate = new Date(dailyHour.workDate);
      return formatDate(workDate, 'yyyy-MM-dd', 'en-US') === formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
    });

    // If an employee is selected, further filter the results
    if (this.selectedEmployeeEmail) {
      this.filteredDailyHours = this.filteredDailyHours.filter(dailyHour => {
        return dailyHour.employees.some((emp: any) => emp.email.trim().toLowerCase() === this.selectedEmployeeEmail.trim().toLowerCase());
      });
    }

    this.cdr.detectChanges();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value ? new Date(event.value) : new Date();
    this.filterDataBySelectedDate();
    this.updateWeekDays(this.selectedDate);
    this.selectTabForDate(this.selectedDate);
  }

  selectTabForDate(date: Date): void {
    const index = this.weekDays.findIndex(day => day.date.toDateString() === date.toDateString());
    if (index !== -1) {
      this.selectedIndex = index;
    } else {
      // If the selected date is not within the current weekDays, update weekDays to include it
      this.updateWeekDays(this.selectedDate);
      this.selectedIndex = this.weekDays.findIndex(day => day.date.toDateString() === date.toDateString());
    }
    this.cdr.detectChanges();
  }

  onTabChange(index: number): void {
    this.selectedIndex = index;
    this.selectedDate = this.weekDays[index].date;
    this.filterDataBySelectedDate();
    this.cdr.detectChanges();
  }

  clearData(): void {
    this.selectedDate = new Date(); // Reset to today's date
    this.selectedMonth = null;
    this.selectedEmployeeEmail = '';
    this.filterApplied = false;
    this.updateWeekDays(this.selectedDate);
    this.filterDataBySelectedDate();
    this.selectTabForDate(this.selectedDate); // Ensure the correct tab is selected
    // No need to fetch data again since we already have it
  }

  onNameChange(event: any): void {
    this.selectedEmployeeEmail = event.value;
    this.filterApplied = !!this.selectedEmployeeEmail; // True if an employee is selected
    this.filterDataBySelectedDate();
    this.cdr.detectChanges();
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
            this.loginService.addTransaction('Post', `Employee daily hours deleted. Employee daily hours ID: ${dailyHourId}`);
            this.fetchData();
          },
          (error) => console.error('Error deleting daily hour:', error)
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
        this.fetchData();
      }
    });
  }
}
