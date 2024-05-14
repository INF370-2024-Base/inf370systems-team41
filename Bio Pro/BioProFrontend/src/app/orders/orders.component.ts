import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orderId: string = '';
  orders: any[] = [];
  baseUrl: string ='https://localhost:44315/Api/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  searchOrders() {
    if (this.orderId.trim() !== '') {
      const url = `${this.baseUrl}GetAllOrders/${this.orderId}`;
      this.http.get<any>(url)
        .subscribe(
          (data) => {
            console.log(data)
            if (data) {
              this.orders = [data]; // Assuming the response is a single order or array of orders
            } else {
              this.orders = []; // Reset orders array if no data found
            }
          },
          (error) => {
            console.error('Error fetching orders:', error);
            this.orders = []; // Reset orders array on error
          }
        );
    } else {
      this.orders = []; // Reset orders array if search input is empty
    }
  }
}



