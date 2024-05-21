import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { ProceduralTimelineViewModel } from '../shared/proceduralTimelineViewModel';

@Injectable({
  providedIn: 'root'
})
export class ProceduralTimelineService {
    apiUrl = 'https://localhost:44315/';

    httpOptions ={
      headers: new HttpHeaders({
        ContentType: 'application/json'
      })
    }
  
    constructor(private httpClient: HttpClient) { 
    }
    addOrder(orderData: ProceduralTimelineViewModel): Observable<ProceduralTimelineViewModel> {
        return this.httpClient.post<ProceduralTimelineViewModel>(`${this.apiUrl}timeline/CreateTimeline`, orderData);
      }
}