import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { OpenOrder } from '../shared/openorder';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { addUser } from '../shared/adduser';
import { ResetPassword, UpdateUser } from '../shared/UpdateUser';
import { AddStock, AddStockItemViewModel, CaptureNewStockViewModel, StockCategoryViewModel, StockTypeViewModel, StockWriteOffViewModel } from '../shared/Stock';
import { StockTypeComponent } from '../stock-type/stock-type.component';
import { StockItems } from '../shared/Stock';

@Injectable({
  providedIn: 'root'
})
export class StockServices {

  apiUrl = 'https://localhost:44315/stock/';

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { 
  }
  getAllStock(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}GetAllStock`)
    .pipe(map(result => result))
  }
  getAllStockCategories(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}GetAllStockCategories`)
    .pipe(map(result => result))
  }
  getAllStockTypes(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}GetAllStockTypes`)
    .pipe(map(result => result))
  }
  
  getStockItems(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}GetAllStockItems`)
    .pipe(map(result => result))
  }

  addStock(stock:AddStock): Observable<AddStock>{
    return this.httpClient.post<AddStock>(`${this.apiUrl}AddStock`,stock)
    .pipe(map(result => result))
  }
  addStockWriteOff(stock:StockWriteOffViewModel): Observable<StockWriteOffViewModel>{
    return this.httpClient.post<StockWriteOffViewModel>(`${this.apiUrl}WriteOffStock`,stock)
    .pipe(map(result => result))
  }
  captureNewStock(stock:CaptureNewStockViewModel): Observable<CaptureNewStockViewModel>{
    return this.httpClient.put<CaptureNewStockViewModel>(`${this.apiUrl}CaptureNewStock`,stock)
    .pipe(map(result => result))
  }
  addStockItem(stockitem: AddStockItemViewModel): Observable<AddStockItemViewModel> {
    return this.httpClient.post<AddStockItemViewModel>(`${this.apiUrl}AddStockItem`, stockitem, this.httpOptions);
  }
  getAllSupplier(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}GetAllSupplier`)
    .pipe(map(result => result))
  }
  getStockById(id:number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}GetStockById/${id}`)
    .pipe(map(result => result))
  }
  CreateStockCategory(stock:StockCategoryViewModel): Observable<CaptureNewStockViewModel>{
    return this.httpClient.post<CaptureNewStockViewModel>(`${this.apiUrl}CreateStockCategory`,stock)
    .pipe(map(result => result))
  }
  CreateStockType(stock:StockCategoryViewModel): Observable<CaptureNewStockViewModel>{
    return this.httpClient.post<CaptureNewStockViewModel>(`${this.apiUrl}CreateStockType`,stock)
    .pipe(map(result => result))
  }
  EditStockCategory(stock:StockCategoryViewModel): Observable<CaptureNewStockViewModel>{
    return this.httpClient.put<CaptureNewStockViewModel>(`${this.apiUrl}EditStockCategory`,stock)
    .pipe(map(result => result))
  }
  EditStockType(stock:StockTypeViewModel): Observable<CaptureNewStockViewModel>{
    return this.httpClient.put<CaptureNewStockViewModel>(`${this.apiUrl}EditStockType`,stock)
    .pipe(map(result => result))
  }
  DeleteStockType(stockTypeId:number):Observable<any[]>
{
  return this.httpClient.delete<any[]>(`${this.apiUrl}DeleteStockType/${stockTypeId}`);
}
DeleteStockCategory(stockCategoryId:number):Observable<any[]>
{
  return this.httpClient.delete<any[]>(`${this.apiUrl}DeleteStockCategory/${stockCategoryId}`);
}
}



