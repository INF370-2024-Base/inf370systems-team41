import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { DecisionViewModel, OpenOrder } from '../shared/ordersViewModel';
import { EditMediaFileViewModel, SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { AddDentalDesignViewModel } from '../orders-awaiting-dental-design/orders-awaiting-dental-design.component';
import { AddMediaFileViewModel } from '../employee-orders-and-steps/employee-orders-and-steps.component';
import { AddStockItemViewModel } from '../shared/Stock';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  apiUrl = 'https://localhost:44315/';

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
  updateOpenOrder(openOrder: OpenOrder): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/EditOpenOrder/${openOrder.openOrderId}`, openOrder);
  }
  updateOrder(order: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Api/UpdateOrder`, order, this.httpOptions);
  }
  addOrder(order: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Api/AddOrders`, order, this.httpOptions);
  }
  AddDecision(decision: DecisionViewModel): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Api/AddDecision`, decision, this.httpOptions);
  }
  addMediaFile(mediaFile: AddMediaFileViewModel): Observable<AddMediaFileViewModel> {
    return this.httpClient.post<AddMediaFileViewModel>(`${this.apiUrl}Api/AddMediaFile`, mediaFile, this.httpOptions);
  }
  editMediaFile(mediaFile: EditMediaFileViewModel): Observable<EditMediaFileViewModel> {
    return this.httpClient.put<EditMediaFileViewModel>(`${this.apiUrl}Api/EditMediaFile`, mediaFile, this.httpOptions);
  }
  

  getOpenOrderId(openOrderID: string): Observable<OpenOrder>{
    return this.httpClient.get<OpenOrder>(`${this.apiUrl}GetOpenOrder/` + openOrderID)
  }

  getAllOrders(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}Api/GetAllOrders`);
  }
  getAllOrderInfo(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}Api/GetAllOrderInfo`);
  }
  getAllOrderById(orderId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Api/GetOrdersById/${orderId}`);
  }
  getOrderDirectionById(orderdirectionId:number): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}Api/GetOrderDirectionById/${orderdirectionId}`);
  }

  getDentists(): Observable<any[]> {
    const endpoint = 'api/api/dentists'; // Update with correct endpoint for fetching dentists
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  getSelecetedAreas(): Observable<any[]> {
    const endpoint = 'api/api/selectedareas'; // Update with correct endpoint for fetching dentists
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  getMedicalAids(): Observable<any[]> {
    const endpoint = 'api/api/medicalaids'; // Update with correct endpoint for fetching medical aids
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }

  getOrderTypes(): Observable<any[]> {
    const endpoint = 'api/api/orderTypes'; // Correct endpoint for fetching order types
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  
  getOrderStatuses(): Observable<any[]> {
    const endpoint = 'api/api/orderStatuses'; // Correct endpoint for fetching order statuses
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  
  getOrderDirections(): Observable<any[]> {
    const endpoint = 'api/api/orderDirections'; // Correct endpoint for fetching order directions
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  
  

  getTeethShades(): Observable<any[]> {
    const endpoint = 'api/api/teethshades'; // Updated endpoint
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  getPendingOrders():Observable<any[]> {
    const endpoint = 'Api/GetPendingOrders'; // Updated endpoint
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  getPendingOrdersCount():Observable<any[]> {
    const endpoint = 'Api/GetPendingOrdersCount'; // Updated endpoint
    return this.httpClient.get<any[]>(`${this.apiUrl}${endpoint}`);
  }
  apporvePendingOrder(orderId:number):Observable<number> {
    const endpoint = `Api/ApprovePendingOrder/${orderId}`; // Updated endpoint
    return this.httpClient.put<number>(`${this.apiUrl}${endpoint}`,orderId);
  }
  dissaprovePendingOrders(orderId:number):Observable<number> {
    const endpoint = `Api/DissaprovePendingOrder/${orderId}`; // Updated endpoint
    return this.httpClient.put<number>(`${this.apiUrl}${endpoint}`,orderId);
  }
  updateOrderAndDeliveryStatus(orderId: string, orderStatusId: number, deliveryStatusId: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/Delivery/RecordOrderDelivery/`, { orderId, orderStatusId, deliveryStatusId });
  }

  searchDeliveryOrder(orderId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/Delivery/SearchDeliveryOrder/${orderId}`);
  }

  trackOrderDelivery(orderId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/Delivery/TrackOrderDelivery/${orderId}`);
  }

  getAllOrdersWithoutTimeline(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/ProceduralTimeline/GetAllOrdersWithoutTimeline`);
  }

  addOrdersToTimeline(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/ProceduralTimeline/AddOrdersToTimeline`, data);
}

getOrderStatus(orderId: string): Observable<any> {
  return this.httpClient.get<any>(`${this.apiUrl}/orders/${orderId}/status`);
}
get3DMediaFile(orderId: string): Observable<any> {
  return this.httpClient.get<any>(`${this.apiUrl}Api/Get3DMediaFile/${orderId}`);
}

getPendingSystemOrders(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.apiUrl}/Timeline/GetOrdersWithoutPendingStatus`);
}
getOrdersWithNoTimelineAndInProgress():Observable<any[]>
{
  return this.httpClient.get<any[]>(`${this.apiUrl}Api/GetOrdersInProgressAndNullTimlines`);
}
getFinishedOrders():Observable<any[]>
{
  return this.httpClient.get<any[]>(`${this.apiUrl}Api/GetFinishedOrders`);
}
deleteMediaFile(mediaFileId:number):Observable<any[]>
{
  return this.httpClient.delete<any[]>(`${this.apiUrl}Api/DeleteMediaFile/${mediaFileId}`);
}
getOrdersAwaitingDentalDesign():Observable<any[]>
{
  return this.httpClient.get<any[]>(`${this.apiUrl}Api/GetOrdersAwaitingDentalDesign`);
}
sendDentalDesign(dentalDesign:AddDentalDesignViewModel):Observable<any[]>
{
  return this.httpClient.post<any[]>(`${this.apiUrl}Api/SendDentalDesign`,dentalDesign);
}
apporveDentalDesign(orderId:string):Observable<string> {
  const endpoint = `Api/ApproveDentalDesign/${orderId}`; 
  return this.httpClient.put<string>(`${this.apiUrl}${endpoint}`,orderId);
}
rejectDentalDesign(orderId:number):Observable<number> {
  const endpoint = `Api/DisapproveDentalDesign/${orderId}`;
  return this.httpClient.put<number>(`${this.apiUrl}${endpoint}`,orderId);
}
GetOrdersAwaitingDentalDesignApproval():Observable<any[]>
{
  return this.httpClient.get<any[]>(`${this.apiUrl}Api/GetOrdersAwaitingDentalDesignApproval`);
}
GetOrdersAwaitingDentalDesignApprovalCount():Observable<any[]>
{
  return this.httpClient.get<any[]>(`${this.apiUrl}Api/GetOrdersAwaitingDentalDesignApprovalCount`);
}
CancelOrder(orderId:string):Observable<any[]>
{
  return this.httpClient.put<any[]>(`${this.apiUrl}Api/CancelOrder/${orderId}`,orderId);
}
}


