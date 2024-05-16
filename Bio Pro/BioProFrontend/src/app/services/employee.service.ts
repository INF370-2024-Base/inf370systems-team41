// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../shared/employee';
import { DailyHours } from '../shared/dailyhours';

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

  editEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.httpClient.put<Employee>(`${this.apiUrl}/EditEmployee/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/DeleteEmployee/${id}`);
  }


  captureEmployeeDailyHours(employeeId: number, dailyHours: DailyHours): Observable<any> {
    const url = `${this.apiUrl}/capture-daily-hours/${employeeId}`;
    return this.httpClient.post<DailyHours>(url, dailyHours);
  }
}
