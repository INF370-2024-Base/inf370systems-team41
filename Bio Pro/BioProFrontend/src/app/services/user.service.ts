import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/ordersViewModel';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { addUser } from '../shared/adduser';
import { ResetPassword, UpdateUser } from '../shared/UpdateUser';
import { EditUser } from '../shared/EditUser';

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
  UpdatePassword(user:UpdateUser): Observable<UpdateUser>{
    return this.httpClient.put<UpdateUser>(`${this.apiUrl}UpdatePassword`,user)
    .pipe(map(result => result))
  }
  ResetUserPassword(user:ResetPassword): Observable<ResetPassword>{
    return this.httpClient.put<ResetPassword>(`${this.apiUrl}ResetPassword`,user)
    .pipe(map(result => result))
  }
  SendResetPasswordEmail(email:string): Observable<string>{
    return this.httpClient.post<string>(`${this.apiUrl}SendResetEmail/${email}`,email)
    .pipe(map(result => result))
  }
  GetUser(email:string): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}GetSignInProfile/${email}`)
    .pipe(map(result => result))
  }
  UpdateUser(user:EditUser): Observable<EditUser>{
    return this.httpClient.put<EditUser>(`${this.apiUrl}EditUser`,user)
    .pipe(map(result => result))
  }
  RemoveAccess(userEmail:string): Observable<string>{
    return this.httpClient.put<string>(`${this.apiUrl}RemoveAccess/${userEmail}`,userEmail)
    .pipe(map(result => result))
  }
  getAllUsers(): Observable<any>
  {
    return this.httpClient.get<any>(`${this.apiUrl}GetAllCurrentUsers`)
  }
}


