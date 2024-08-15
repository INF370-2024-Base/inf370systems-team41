import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';
import { Employee } from '../shared/employee';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDeleteDailyHourComponent } from '../confirm-delete-daily-hour/confirm-delete-daily-hour.component';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-daily-hours-profile',
  templateUrl: './daily-hours-profile.component.html',
  styleUrls: ['./daily-hours-profile.component.scss']
})

export class DailyHoursProfileComponent implements OnInit {
  dailyHours: DailyHours[] = [];
  employees: Employee[] = [];
  isLoading: boolean = true;
  dailyHoursData: DailyHours[] = [];
  filterDate: Date | null = null;
  selectedDate: string | null = null;
  filterEmployeeName: string = '';
  selectedEmployeeEmail: string = '';
  selectedWeek: Date = new Date();
  endOfWeek: Date = new Date();
  
  groupedDailyHoursData: { [key: string]: { employeeName: string; hours: number; }[] } = {};


  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private employeeService: EmployeeService, 
    private dialog: MatDialog,
    private zone: NgZone) {}

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
            console.log('Employees fetched:', this.employees);
            
            this.employeeService.getEmployeeDailyHours().subscribe(
                (hoursResults) => {
                    this.dailyHoursData = hoursResults;
                    console.log('Daily Hours fetched:', this.dailyHoursData);
                    
                    this.groupDailyHoursByWeek();  // Process the data after fetching
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
    // Reset the grouped data structure
    this.groupedDailyHoursData = {};

    console.log('Daily Hours Data:', this.dailyHoursData);
    console.log('Employees Data:', this.employees);

    this.dailyHoursData.forEach((hour: any) => {
        // Access the nested WorkDate and EmployeeId
        const workDate = new Date(hour.workDate || hour.WorkDate || (hour.employees[0]?.workDate));
        const employeeId = hour.EmployeeId || hour.employeeId || (hour.employees[0]?.employeeId);

        if (!workDate || !employeeId || isNaN(workDate.getTime())) {
            console.log('Skipping entry due to missing or invalid WorkDate or EmployeeId:', hour);
            return;
        }

        const formattedDate = workDate.toISOString().split('T')[0];

        // Ensure there's a group for the given date
        if (!this.groupedDailyHoursData[formattedDate]) {
            this.groupedDailyHoursData[formattedDate] = [];
        }

        // Find the corresponding employee in the main employees array
        const employee = this.employees.find(e => e.EmployeeId === employeeId);
        if (!employee) {
            console.log('Employee not found for EmployeeId:', employeeId);
            return;
        }

        // Add the employee and their hours to the group
        this.groupedDailyHoursData[formattedDate].push({
            employeeName: `${employee.FirstName} ${employee.LastName}`,
            hours: hour.Hours || hour.hours
        });
    });

    console.log('Final Grouped Daily Hours Data:', JSON.stringify(this.groupedDailyHoursData, null, 2));
}





  getEmployeeEmailById(employeeId: number): string | undefined {
    const employee = this.employees.find(emp => emp.EmployeeId === employeeId);
    return employee ? employee.EmailAddress : undefined;
  }

  

  getEmployeeName(email: string): string {
    const employee = this.employees.find(e => e.EmailAddress === email);
    return employee ? `${employee.FirstName} ${employee.LastName}` : 'Unknown';
  }

  getDateString(dayIndex: number): string {
    const date = new Date(this.selectedWeek);
    date.setDate(this.selectedWeek.getDate() + dayIndex);
    return date.toISOString().split('T')[0];
  }


  getEmployeeEmails(dateString: string): string[] {
    return this.groupedDailyHoursData[dateString] ? Object.keys(this.groupedDailyHoursData[dateString]) : [];
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