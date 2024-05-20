import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { addUser } from '../shared/adduser';

@Injectable({
  providedIn: 'root'
})
export class UserServices {

  apiUrl = 'https://localhost:44315/';

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { 
  }
  getRoles(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}GetRoles`)
    .pipe(map(result => result))
  }
  addUser(user:addUser): Observable<addUser>{
    return this.httpClient.post<addUser>(`${this.apiUrl}Register`,user)
    .pipe(map(result => result))
  }
 
  
}


