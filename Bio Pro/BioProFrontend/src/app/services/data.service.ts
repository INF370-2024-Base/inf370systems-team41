import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { Dentist } from '../shared/dentist';
import { Employee } from '../shared/employee';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'https://localhost:44315/';

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { 
  }

  addDentist(dentist: Dentist): Observable<Dentist> {
    return this.httpClient.post<Dentist>(`${this.apiUrl}api/Dentist/AddDentist`, dentist);
  }
  addEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>('https://localhost:44315/api/Employee/AddEmployee', employee);
  }
}


