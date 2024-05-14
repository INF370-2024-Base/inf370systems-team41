import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'https://localhost:44315/api/';

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

  addOrder(orderData: SystemOrderViewModel): Observable<any> {
    console.log(orderData)
    return this.httpClient.post<SystemOrderViewModel>(`${this.apiUrl}AddOrders`, orderData);
  }



  getAllOrders(orderId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}api/GetAllOrders/${orderId}`);
  }
  createNewOrder(OrderDetails: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}AddOrders`,OrderDetails);
  }
  getAllOrderById(orderId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}api/GetAllOrder/${orderId}`);
  }

  getDentists(): Observable<any[]> {
    const endpoint = 'api/dentists'; // Update with correct endpoint for fetching dentists
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  getSelecetedAreas(): Observable<any[]> {
    const endpoint = 'api/selectedareas'; // Update with correct endpoint for fetching dentists
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  getMedicalAids(): Observable<any[]> {
    const endpoint = 'api/medicalaids'; // Update with correct endpoint for fetching medical aids
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }

  getOrderTypes(): Observable<any[]> {
    const endpoint = 'api/orderTypes'; // Correct endpoint for fetching order types
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  
  getOrderStatuses(): Observable<any[]> {
    const endpoint = 'api/orderStatuses'; // Correct endpoint for fetching order statuses
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  
  getOrderDirections(): Observable<any[]> {
    const endpoint = 'api/orderDirections'; // Correct endpoint for fetching order directions
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }

  getTeethShades(): Observable<any[]> {
    const endpoint = 'api/teethshades'; // Updated endpoint
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
}


