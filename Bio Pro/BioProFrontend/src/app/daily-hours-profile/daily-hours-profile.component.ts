import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;

    this.employeeService.getEmployeeDailyHours().subscribe(
      
      (results) => {
        this.dailyHoursData = results;
        console.log('Fetched daily hours:', this.dailyHoursData);
        this.employeeService.getAllEmployees().subscribe(
      
          (results) => {
            this.employees = results;
            this.isLoading=false
          },
          (error) => {
            console.error('Error fetching daily hours:', error);
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

  onDateChange(event: any): void {
    this.filterDate = event.target.value ? new Date(event.target.value) : null;
    if (this.filterDate != null) {
      this.employeeService.getEmployeeDailyHoursByDate(this.filterDate).subscribe(
        (results) => {
          this.dailyHoursData = results;
          this.selectedEmployeeEmail = '';
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
    }
  }

  clearData(): void {
    this.selectedDate = null;
    this.selectedEmployeeEmail = '';
  }

  onNameChange(event: any): void {
    this.filterEmployeeName = event.target.value;
    this.employeeService.getEmployeeDailyHoursByEmployeeEmail(this.filterEmployeeName).subscribe(
      (results) => {
        this.dailyHoursData = results;
        this.isLoading = false;
        this.selectedDate = null;
      },
      (error) => {
        console.error('Error fetching daily hours:', error);
        this.isLoading = false;
      }
    );
  }
  onDeleteDailyHour(dailyHourId: number): void {
    // Prompt the user for confirmation before deleting
    if (confirm(`Are you sure you want to delete the daily hour entry with ID: ${dailyHourId}?`)) {
      this.employeeService.deleteEmployeeDailyHours(dailyHourId).subscribe(
        () => {
          console.log(`Successfully deleted daily hour with ID: ${dailyHourId}`);
          // Optionally, refresh the list of daily hours after deletion
          this.fetchData(); // Assuming fetchData() reloads the data from the backend
        },
        (error) => {
          console.error('Error deleting daily hour:', error);
          // Handle the error appropriately, e.g., showing an error message to the user
          return;
        }
      );
    }
  }
  

}
