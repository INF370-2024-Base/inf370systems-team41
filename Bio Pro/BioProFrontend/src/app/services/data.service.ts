import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';
import { Employee } from '../shared/employee';
import { Dentist } from '../shared/dentist';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'https://localhost:44315/'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { 
  }

  getOpenOrders(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}GetAllOpenOrders`)
    .pipe(map(result => result))
  }


  getOpenOrderId(openOrderID: string): Observable<OpenOrder>{
    return this.httpClient.get<OpenOrder>(`${this.apiUrl}GetOpenOrder/` + openOrderID)
  }

  addEmployee(addEmployeeAtt: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.apiUrl}Employee/AddEmployee`, addEmployeeAtt)
     .pipe(map(result => result));
  }
  
  addDentist(dentist: Dentist): Observable<Dentist> {
    return this.httpClient.post<Dentist>(`${this.apiUrl}Dentist/AddDentist`, dentist)
    .pipe(map(result => result));
  }
}


