import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';
import { Employee } from '../shared/employee';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDeleteDailyHourComponent } from '../confirm-delete-daily-hour/confirm-delete-daily-hour.component';


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
  filterDate: Date | null = null;
  selectedDate: string | null = null;
  filterEmployeeName: string = '';
  selectedEmployeeEmail: string = '';
  selectedWeek: Date = new Date();
  endOfWeek: Date = new Date();
  
  groupedDailyHoursData: { [key: string]: { [key: string]: DailyHours[] } } = {};

  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.selectedWeek = this.getStartOfWeek(new Date());
    this.endOfWeek = new Date(this.selectedWeek);
    this.endOfWeek.setDate(this.endOfWeek.getDate() + 6);
    this.fetchData();
  }
  
  fetchData(): void {
    this.isLoading = true;
    
    this.employeeService.getAllEmployees().subscribe(
      (results) => {
        this.employees = results;
        console.log('Employees:', this.employees); // Check employees data
        this.employeeService.getEmployeeDailyHours().subscribe(
          (hoursResults) => {
            this.dailyHoursData = hoursResults;
            console.log('Daily Hours:', this.dailyHoursData); // Check daily hours data
            this.groupDailyHoursByWeek();
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching daily hours:', error);
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
  
  
  navigateWeek(direction: number): void {
    this.selectedWeek.setDate(this.selectedWeek.getDate() + direction * 7);
    this.selectedWeek = this.getStartOfWeek(this.selectedWeek);
    this.endOfWeek = new Date(this.selectedWeek);
    this.endOfWeek.setDate(this.endOfWeek.getDate() + 6);
    this.groupDailyHoursByWeek();
  }
  

getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(start.setDate(diff));
}


groupDailyHoursByWeek(): void {
  const startOfWeek = this.getStartOfWeek(this.selectedWeek);
  this.endOfWeek = new Date(startOfWeek);
  this.endOfWeek.setDate(this.endOfWeek.getDate() + 6);

  console.log('Start of Week:', startOfWeek);
  console.log('End of Week:', this.endOfWeek);

  this.groupedDailyHoursData = this.dailyHoursData.reduce((acc, hour) => {
    const workDate = new Date(hour.workDate); 
    workDate.setHours(0, 0, 0, 0); 

    if (workDate >= startOfWeek && workDate <= this.endOfWeek) {
      const dayKey = workDate.toISOString().split('T')[0];
      if (!acc[dayKey]) acc[dayKey] = {};

      const email = this.getEmployeeEmailById(hour.employeeId);
      if (email) {
        if (!acc[dayKey][email]) acc[dayKey][email] = [];
        acc[dayKey][email].push(hour);
      }
    }
    return acc;
  }, {} as { [key: string]: { [key: string]: DailyHours[] } });

  console.log('Grouped Daily Hours Data:', this.groupedDailyHoursData);
}




  getEmployeeEmailById(employeeId: number): string | undefined {
    const employee = this.employees.find(e => e.EmployeeId === employeeId);
    return employee ? employee.EmailAddress : undefined;
  }

  getEmployeeName(email: string): string {
    const employee = this.employees.find(e => e.EmailAddress === email);
    return employee ? `${employee.FirstName} ${employee.LastName}` : 'Unknown';
  }

  getDateString(dayIndex: number): string {
    const date = new Date(this.getStartOfWeek(this.selectedWeek));
    date.setDate(date.getDate() + dayIndex);
    console.log('Generated Date String for Day Index', dayIndex, ':', date.toISOString().split('T')[0]);
    return date.toISOString().split('T')[0];
  }
  

  getEmployeeEmails(dayKey: string): string[] {
    return Object.keys(this.groupedDailyHoursData[dayKey] || {});
  }

  // navigateWeek(direction: number): void {
  //   this.selectedWeek.setDate(this.selectedWeek.getDate() + direction * 7);
  //   this.groupDailyHoursByWeek();
  // }

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
  clearData(): void {
    this.selectedDate = null;
    this.selectedEmployeeEmail = '';
    this.fetchData();
  }
  onNameChange(event: any): void {
    const name = event.target.value.trim();
    if (name) {
      this.filterEmployeeName = name;
      this.employeeService.getEmployeeDailyHoursByEmployeeEmail(this.filterEmployeeName).subscribe(
        (results) => {
          this.dailyHoursData = results;
          this.groupDailyHoursByWeek();
          this.isLoading = false;
          this.selectedDate = null;
        },
        (error) => {
          console.error('Error fetching daily hours:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.clearData();
    }
  }
  
  onDateChange(event: any): void {
    this.filterDate = event.target.value ? new Date(event.target.value) : null;
    if (this.filterDate) {
      this.employeeService.getEmployeeDailyHoursByDate(this.filterDate).subscribe(
        (results) => {
          this.dailyHoursData = results;
          this.groupDailyHoursByWeek();
          this.selectedEmployeeEmail = '';
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
    } else {
      this.clearData();
    }
  }
  
}