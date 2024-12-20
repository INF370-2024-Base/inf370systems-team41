import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject,tap,of,BehaviorSubject, throwError  } from 'rxjs';
import { Dentist } from '../shared/dentist';
import { Employee } from '../shared/employee';
import { SystemUser } from '../shared/systemuser';
import { catchError } from 'rxjs/operators';
import { AddAuditTrailViewModels } from '../shared/addAuditTrailViewModel';
import { RoleGuardService } from './roleCheck';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  user:any
  apiUrl = 'https://localhost:44315/';
  jwt:any
  SignInUserEmail:string="";
  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient,private roleService:RoleGuardService) { 
  }

  addDentist(dentist: Dentist): Observable<Dentist> {
    return this.httpClient.post<Dentist>(`${this.apiUrl}api/Dentist/AddDentist`, dentist);
  }
  addEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>('https://localhost:44315/api/Employee/AddEmployee', employee);
    
  }
  checkSignInStatus(): Observable<any>  {
    this.jwt = JSON.parse(sessionStorage.getItem('Token')!);
    this.SignInUserEmail = this.jwt.user;
    console.log('email:'+this.SignInUserEmail)
    if (this.jwt) {
      return this.getSignInUser(this.SignInUserEmail).pipe(
        tap((result: SystemUser) => {
          this.user=result
          sessionStorage.setItem('User',JSON.stringify(this.user));
          this.roleService.getRoles()
          console.log(this.user)
                })
      );
    
    }
    else 
    return of(null);
  }
  Login(user: SystemUser): Observable<any> { // Return Observable for error handling
    return this.httpClient.post<any>(`${this.apiUrl}Login`, user)
      .pipe(
        catchError((error) => {
          return throwError(this.handleLoginError(error)); // Throw an error with the message
        })
      );
  }

  private handleLoginError(error: any): string {
    if (error.status === 404) {
      return 'Invalid login credentials'; // Email not found
    } else if (error.status === 400) {
      return 'Invalid login credentials'; // Password incorrect (avoid revealing email exists)
    } else {
      return 'An error occurred. Please try again later.'; // Generic error message for other server errors
    }
  }
  getSignInUser(EmailAddress:string): Observable<any>
  {
    return this.httpClient.get<any>(`${this.apiUrl}GetSignInProfile/${EmailAddress}`)
  }
  getAllUsers(): Observable<any>
  {
    return this.httpClient.get<any>(`${this.apiUrl}GetAllCurrentUsers`)
  }
  CreateTransaction(transaction: AddAuditTrailViewModels): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.apiUrl}CreateTransaction`, transaction);
    
  }
  GetAllTransaction(): Observable<any>
  {
    return this.httpClient.get<any>(`${this.apiUrl}GetAllTransaction`)
  }
  addTransaction(TransactionTypeText: string, AdditionalData: string): void {
    const signedInUser = JSON.parse(sessionStorage.getItem('User')!);
    const id = signedInUser.id;

    const transaction: AddAuditTrailViewModels = {
      AdditionalData: AdditionalData,
      DateOfTransaction: new Date(),
      TransactionType: TransactionTypeText,
      SystemUserId: id
    };

    console.log(transaction);

    this.CreateTransaction(transaction).subscribe(
      result => {
        console.log("Successfully added transaction.");
        console.log(result);
      },
      error => {
        console.log("Unable to add transaction.");
        console.log(error.error);
      }
    );
  }
 
}


