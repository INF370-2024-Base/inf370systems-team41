import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { ProceduralTimelineViewModel } from '../shared/proceduralTimelineViewModel';
import { DeliverAddViewModel } from '../shared/deliverAddViewModel';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
    apiUrl = 'https://localhost:44315/';

    httpOptions ={
      headers: new HttpHeaders({
        ContentType: 'application/json'
      })
    }
  
    constructor(private httpClient: HttpClient) { 
    }
    getdeliveries(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiUrl}delivery/GetDeliveries`);
      }
      GetDeliveryStatuses(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiUrl}delivery/GetDeliveryStatuses`);
      }
        createdelivery(delivery:DeliverAddViewModel): Observable<DeliverAddViewModel> {
        return this.httpClient.post<DeliverAddViewModel>(`${this.apiUrl}delivery/createDelivery`,delivery);
      }
      UpdateDeliveryCollected(id: number): Observable<any> {
        return this.httpClient.put(`${this.apiUrl}delivery/UpdateDeliveryCollected/${id}`,id);
      }

}