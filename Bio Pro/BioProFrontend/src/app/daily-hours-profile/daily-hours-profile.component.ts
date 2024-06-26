import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';
import { Employee } from '../shared/employee';

@Component({
  selector: 'app-daily-hours-profile',
  templateUrl: './daily-hours-profile.component.html',
  styleUrls: ['./daily-hours-profile.component.scss']
})
export class DailyHoursProfileComponent implements OnInit {
  dailyHours: DailyHours[] = [];
  employees: Employee[] = [];
  combinedData: { WorkDate: Date; Hours: number; employeeName: string }[] = [];
  filteredData: { WorkDate: Date; Hours: number; employeeName: string }[] = [];
  isLoading: boolean = true;

  filterDate: Date | null = null;
  filterEmployeeName: string = '';

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;

    // Fetch daily hours
    this.employeeService.getEmployeeDailyHours().subscribe(
      (dailyHoursData: DailyHours[]) => {
        this.dailyHours = dailyHoursData;
        console.log('Fetched daily hours:', dailyHoursData);

        // Fetch employees
        this.employeeService.getAllEmployees().subscribe(
          (employeeData: Employee[]) => {
            this.employees = employeeData;
            console.log('Fetched employees:', employeeData);

            // Merge data
            this.mergeData();
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

  mergeData(): void {
    this.combinedData = this.dailyHours.map(dailyHour => {
      const employee = this.employees.find(emp => emp.EmployeeId === dailyHour.EmployeeId);
      return {
        WorkDate: dailyHour.WorkDate,
        Hours: dailyHour.Hours,
        employeeName: employee ? `${employee.FirstName} ${employee.LastName}` : 'Unknown'
      };
    });

    this.filteredData = this.combinedData;
    console.log('Combined data:', this.combinedData); // Log the combined data
  }

  filterData(): void {
    this.filteredData = this.combinedData.filter(item => {
      const matchesDate = this.filterDate ? new Date(item.WorkDate).toDateString() === new Date(this.filterDate).toDateString() : true;
      const matchesName = this.filterEmployeeName ? item.employeeName.toLowerCase().includes(this.filterEmployeeName.toLowerCase()) : true;
      return matchesDate && matchesName;
    });
  }

  onDateChange(event: any): void {
    this.filterDate = event.target.value ? new Date(event.target.value) : null;
    this.filterData();
  }

  onNameChange(event: any): void {
    this.filterEmployeeName = event.target.value;
    this.filterData();
  }
}
