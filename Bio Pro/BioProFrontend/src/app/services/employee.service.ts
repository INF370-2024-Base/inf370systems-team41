// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../shared/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:44315/api/Employee';

  constructor(private httpClient: HttpClient) { }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.apiUrl}/AddEmployee`, employee);
  }

  // Add other CRUD operations as needed
}
