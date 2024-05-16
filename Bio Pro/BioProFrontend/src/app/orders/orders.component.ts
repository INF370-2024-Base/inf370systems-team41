import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orderId: string = '';
  orders: any[] = [];
  ordersInfo: any[] = [];
  baseUrl: string = 'https://localhost:44315/Api/';
  selectedOrder: any = null;

  constructor(private http: HttpClient, private dataservices: DataService) { }

  ngOnInit(): void {
    this.dataservices.getAllOrders().subscribe(result => {
      let allOrders: any[] = result;
      if (Array.isArray(allOrders)) {
        allOrders.forEach((element) => {
          this.orders.push(element);
          this.getOrderInfo();
        });
      }
    });
  }

  getOrderInfo(): void {
    this.ordersInfo = [];
    this.orders.forEach((order) => {
      this.dataservices.getAllOrderInfo(order.orderId).subscribe(
        (result: any) => {
          this.ordersInfo.push(result);
          console.log(this.ordersInfo); // Log the ordersInfo to inspect its structure
        },
        (error) => {
          console.error('Error fetching order info:', error);
        }
      );
    });
  }

  searchOrders(): void {
    if (this.orderId.trim() !== '') {
      const url = `${this.baseUrl}GetOrdersById/${this.orderId}`;
      this.http.get<any>(url)
        .subscribe(
          (data) => {
            if (data) {
              this.orders = [data];
              this.getOrderInfo();
            } else {
              this.orders = [];
            }
          },
          (error) => {
            console.error('Error fetching orders:', error);
            this.orders = [];
          }
        );
    } else {
      this.orders = [];
    }
  }

  editOrder(orderId: string): void {
    this.selectedOrder = this.ordersInfo.find(order => order.systemOrder.orderId === orderId);
  }

  closeModal(): void {
    this.selectedOrder = null;
  }

  deleteOrder(orderId: string): void {
    console.log('Delete order:', orderId);
    // Implement your delete order logic here
  }
}
