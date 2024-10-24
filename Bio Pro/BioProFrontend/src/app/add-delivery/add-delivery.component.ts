import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../services/deliver.service';
import { OrderService } from '../services/order.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { DeliverAddViewModel } from '../shared/deliverAddViewModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/login.service';
@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.scss']
})
export class AddDeliveryComponent implements OnInit {

  constructor(private snackBar:MatSnackBar,private deliveryService:DeliveryService,private orderService:OrderService,private dataService:DataService) { 

  }
orders:any[]=[]
orderInfo:any[]=[]
email:any

  ngOnInit(): void {
    this.getsystemOrders()
  }
  getsystemOrders() {
    this.orderService.getFinishedOrders().subscribe(results => {
      this.orderInfo = results;
      console.log(this.orderInfo)
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
        this.dataService.addTransaction("Post","User created delivery for order with id:"+ delivery.SystemOrderId)
      console.log(result)
      location.reload()
      },
      (error:HttpErrorResponse)=>
        {
          this.showSnackBar(error.error)
        }
    )
  }
  showSnackBar(message:string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000, 
    });
  }
}
