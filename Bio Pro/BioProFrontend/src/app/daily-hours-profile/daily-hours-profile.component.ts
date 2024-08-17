import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDeleteDailyHourComponent } from '../confirm-delete-daily-hour/confirm-delete-daily-hour.component';
import { formatDate } from '@angular/common';
import { CaptureEmployeeHoursComponent } from '../capture-employee-hours/capture-employee-hours.component';
import { ChangeDetectorRef } from '@angular/core';
import { Employee } from '../shared/employee';

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
  selectedIndex: number = 0; // Add this line
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


  constructor(private employeeService: EmployeeService, private dialog: MatDialog, private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.updateWeekDays(this.selectedDate);
    this.fetchData();
  }

  updateWeekDays(selectedDate: Date): void {
    const startOfWeek = this.getStartOfWeek(selectedDate);
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        label: formatDate(currentDate, 'EEEE, MMMM d, yyyy', 'en-US'),
        date: currentDate
      });
    }
  
    // Ensure UI updates correctly
    this.cdr.detectChanges();
  }
  
  
  trackByDate(index: number, day: { date: Date }): string {
    return day.date.toISOString(); // Or any other unique identifier for the day
  }
  
  

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
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
    this.filteredDailyHours = this.dailyHoursData.filter(dailyHour => {
      const workDate = new Date(dailyHour.workDate);
      return formatDate(workDate, 'yyyy-MM-dd', 'en-US') === formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
    });
    this.cdr.detectChanges(); // Ensure the filtered data triggers a UI update
  }
  
  
  

  onDateChange(event: any): void {
    this.selectedDate = event.value ? new Date(event.value) : new Date();
    this.filterDataBySelectedDate();
    this.updateWeekDays(this.selectedDate); // Update weekDays based on the selectedDate
    this.selectTabForDate(this.selectedDate); // Make sure the correct tab is selected
  }
  
  selectTabForDate(date: Date): void {
    const index = this.weekDays.findIndex(day => day.date.toDateString() === date.toDateString());
    if (index !== -1) {
      this.selectedIndex = index; // Set the selected index for the tab group
      this.cdr.detectChanges(); // Trigger change detection
    }
  }
  
  onMonthChange(event: any): void {
    this.selectedMonth = event.value ? event.value : null;
    this.filterDataBySelectedDate();
}                                                        
getMonthName(month: number): string {
  const date = new Date();
  date.setMonth(month - 1);
  return formatDate(date, 'MMMM', 'en-US');
}

onTabChange(index: number): void {
  this.selectedIndex = index;
  this.selectedDate = this.weekDays[index].date; // Set selectedDate based on the selected tab
  this.filterDataBySelectedDate();
  // No need to reset week days to Monday, keep the selected date intact
  this.cdr.detectChanges(); // Ensure the UI updates correctly
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
  
    if (this.selectedEmployeeEmail) {
      this.filterApplied = true; // Set the flag to true when the filter is applied
  
      // Debugging: Log the selected employee email
      console.log('Selected Employee Email:', this.selectedEmployeeEmail);
  
      // Debugging: Log the first entry of dailyHoursData to inspect its structure
      if (this.dailyHoursData.length > 0) {
        console.log('Daily Hours Data Sample:', this.dailyHoursData[0]);
      }
  
      // Filter the dailyHoursData by the selected employee email
      this.filteredDailyHours = this.dailyHoursData.filter(dailyHour => {
        const matchFound = dailyHour.employees.some((emp: any) => {
          console.log('Inspecting employee:', emp);
          if (emp.EmailAddress) {
            const isMatch = emp.EmailAddress.trim().toLowerCase() === this.selectedEmployeeEmail.trim().toLowerCase();
            console.log('Comparing:', emp.EmailAddress, 'with', this.selectedEmployeeEmail, '=>', isMatch);
            return isMatch;
          }
          return false;
        });
  
        return matchFound;
      });
  
      // Debugging: Log the filtered result
      console.log('Filtered Daily Hours:', this.filteredDailyHours);
    } else {
      this.filterApplied = false; // Reset the flag when the filter is cleared
      this.filterDataBySelectedDate(); // Reset to filter by date if no employee is selected
    }
  
    // Trigger change detection to update the UI
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