import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { DailyHours } from '../shared/dailyhours';
import { Employee } from '../shared/employee';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-daily-hours-profile',
  templateUrl: './daily-hours-profile.component.html',
  styleUrls: ['./daily-hours-profile.component.scss']
})
export class DailyHoursProfileComponent implements OnInit {
  dailyHours: DailyHours[] = [];
  employees: any[] = [];
  combinedData: { WorkDate: Date; Hours: number; employeeName: string }[] = [];
  filteredData: { WorkDate: Date; Hours: number; employeeName: string }[] = [];
  isLoading: boolean = true;
  dailyHoursData:any[]=[]
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
    if(this.filterDate!=null){
      this.employeeService.getEmployeeDailyHoursByDate(this.filterDate).subscribe(results=>{
        this.dailyHoursData=results
        this.selectedEmployeeEmail=''
      },(error:HttpErrorResponse)=>{
          console.log(error.error)
      }
    )
    }
  }
 clearData()
 {
  this.selectedDate=null
  this.selectedEmployeeEmail=''
 }
  onNameChange(event: any): void {
    this.filterEmployeeName = event.target.value;
    this.employeeService.getEmployeeDailyHoursByEmployeeEmail(this.filterEmployeeName).subscribe(
      (results) => {
        this.dailyHoursData = results;
        this.isLoading=false
        this.selectedDate=null
      },
      (error) => {
        console.error('Error fetching daily hours:', error);
        this.isLoading = false;
      }
    );
  }
}
