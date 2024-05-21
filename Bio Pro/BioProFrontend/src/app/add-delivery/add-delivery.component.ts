import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../services/deliver.service';
import { OrderService } from '../services/order.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { DeliverAddViewModel } from '../shared/deliverAddViewModel';
@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.scss']
})
export class AddDeliveryComponent implements OnInit {

  constructor(private deliveryService:DeliveryService,private orderService:OrderService) { 

  }
orders:any[]=[]
orderInfo:any[]=[]
email:any

  ngOnInit(): void {
    this.getsystemOrders()
  }
  getsystemOrders() {
    this.orderService.getFinishedOrders().subscribe(results => {
      this.orders = results;
      results.forEach(element => {
        this.orderService.getAllOrderInfo(element.orderId).subscribe(results => {
          this.orderInfo.push(results);
          console.log(this.orderInfo);
        });
      });
    }, (error: HttpErrorResponse) => console.log(error));
  }
  createdeliveries(systemOrderId:string)
  {
    let user = sessionStorage.getItem('User');
    let userEmail = '';
    
    if (user) {
      try {
        let userObject = JSON.parse(user);
        userEmail = userObject.email;
      } catch (e) {
        console.error('Error parsing user from sessionStorage', e);
      }
    }

    let delivery: DeliverAddViewModel = {
      EmployeeEmail: userEmail,
      SystemOrderId: systemOrderId
    };
    this.deliveryService.createdelivery(delivery).subscribe(
      result=>{
      console.log(result)
      location.reload()
      },
      (error:HttpErrorResponse)=>
        {
          console.error(error)
        }
    )
  }
}
