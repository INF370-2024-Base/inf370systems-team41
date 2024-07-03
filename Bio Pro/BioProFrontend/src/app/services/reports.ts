import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { ResetPassword, UpdateUser } from '../shared/UpdateUser';
import {  StockWriteOffViewModel } from '../shared/Stock';
import { OrderTypeWithCount } from '../shared/OrderTypeWithCount';
import { EmployeeMonthlyHours } from '../shared/EmployeeMonthlyHours';
import { StockTypeCountByCategory } from '../shared/StockTypeCountByCategory';
import {StockItemCountByCategory} from '../shared/StockItemCountByCategory';
import { ReportsComponent } from '../reports/reports.component';
import { EmployeeHoursReport } from '../shared/EmployeeHoursReport';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ReportsServices {

  apiUrl = 'https://localhost:44315/api/Reports/';

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) { 
  }
  
 
  getAllStockWriteOffs(): Observable<StockWriteOffViewModel[]> {
    return this.httpClient.get<StockWriteOffViewModel[]>(`${this.apiUrl}GetAllStockWriteOffs`, this.httpOptions)
      .pipe(map(result => result));
  }

  // Method to get order types with order count
  getOrderTypesWithOrderCount(): Observable<OrderTypeWithCount[]> {
    return this.httpClient.get<OrderTypeWithCount[]>(`${this.apiUrl}ordertypes/with-order-count`, this.httpOptions)
      .pipe(map(result => result));
  }

  getAllOrders(): Observable<SystemOrderViewModel[]> {
    return this.httpClient.get<SystemOrderViewModel[]>(`${this.apiUrl}GetAllOrders`, this.httpOptions)
      .pipe(map(result => result));
  }

  // Method to get stock types count by category
  getStockTypesCountByCategory(): Observable<StockTypeCountByCategory[]> {
    return this.httpClient.get<StockTypeCountByCategory[]>(`${this.apiUrl}StockTypesCountByCategory`, this.httpOptions)
      .pipe(
        map(result => result),
        
      );
  }

  getStockItemsCountByCategory(): Observable<StockItemCountByCategory[]> {
    return this.httpClient.get<StockItemCountByCategory[]>(`${this.apiUrl}StockItemsCountByCategory`, this.httpOptions)
      .pipe(
        map(result => result),
       
      );
  }

  // Method to get employees with monthly hours
  getEmployeesWithMonthlyHours(): Observable<EmployeeMonthlyHours[]> {
    return this.httpClient.get<EmployeeMonthlyHours[]>(`${this.apiUrl}GetEmployeesWithMonthlyHours`, this.httpOptions)
      .pipe(map(result => result));
  }

  getEmployeesWithWeeklyHours(): Observable<EmployeeHoursReport[]> {
    return this.httpClient.get<EmployeeHoursReport[]>(`${this.apiUrl}GetEmployeesWithWeeklyHours`, this.httpOptions)
      .pipe(map(result => result));
  }


  
}



