// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../shared/employee';
import { DailyHours } from '../shared/dailyhours';
import { addEmployee } from '../shared/addEmployee';
import { EditEmployee } from '../shared/EditEmployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:44315/api/Employee';

  constructor(private httpClient: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}/GetAllEmployee`);
  }

  searchEmployees(searchString: string): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}/SearchEmployees?searchString=${searchString}`);
  }
  getJobtitles(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/getjobtitles`);
  }
  addEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.apiUrl}/AddEmployee`, employee);
    
  }

  editEmployee(Employee:EditEmployee): Observable<EditEmployee> {
    return this.httpClient.put<EditEmployee>(`${this.apiUrl}/EditEmployee`, Employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/DeleteEmployee/${id}`);
  }
  getEmployeeByEmail(email: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetEmployeeInfoByEmail/${email}`);
  }

  captureEmployeeDailyHours(employeeId: number, dailyHours: DailyHours): Observable<any> {
    const url = `${this.apiUrl}/capture-daily-hours/${employeeId}`;
    return this.httpClient.post<DailyHours>(url, dailyHours);
  }
  deleteEmployeeDailyHours(employeedDailyHoursId: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/DeleteEmployeeDailyHours/${employeedDailyHoursId}`);
  }
  getEmployeeDailyHours(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetEmployeeDailyHours`);
  }
  GetCurrentOrders(email:string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetCurrentOrders/${email}`);
  }
  CompleteStepAndJob(stepId:number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/CompleteStepAndJob/${stepId}`,stepId);
  }
  getEmployeeDailyHoursByDate(date: Date): Observable<any> {
    // Create query parameters
    const params = new HttpParams().set('date', date.toISOString());

    // Make the HTTP request
    return this.httpClient.get(`${this.apiUrl}/GetEmployeeDailyHoursByDate`, { params });
  }
  getEmployeeDailyHoursByEmployeeEmail(email:string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetEmployeeDailyHoursByEmployee/${email}`);
  }
}
