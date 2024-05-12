import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'https://localhost:7280/api/';

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

  addOrder(orderData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}AddOrders`, orderData, this.httpOptions);
  }



  getAllOrders(orderId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}GetAllOrders/${orderId}`);
  }

  getAllOrderById(orderId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}GetAllOrder/${orderId}`);
  }

  getDentists(): Observable<any[]> {
    const endpoint = 'dentists'; // Update with correct endpoint for fetching dentists
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  getMedicalAids(): Observable<any[]> {
    const endpoint = 'medicalaids'; // Update with correct endpoint for fetching medical aids
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }

  getOrderTypes(): Observable<any[]> {
    const endpoint = 'orderTypes'; // Correct endpoint for fetching order types
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  
  getOrderStatuses(): Observable<any[]> {
    const endpoint = 'orderStatuses'; // Correct endpoint for fetching order statuses
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  
  getOrderDirections(): Observable<any[]> {
    const endpoint = 'orderDirections'; // Correct endpoint for fetching order directions
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  
}


