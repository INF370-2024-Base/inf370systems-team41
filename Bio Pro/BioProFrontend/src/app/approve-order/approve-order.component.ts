import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-approve-order',
  templateUrl: './approve-order.component.html',
  styleUrls: ['./approve-order.component.scss']
})
export class ApproveOrderComponent implements OnInit {

  constructor( private dataService: OrderService,private snackBar: MatSnackBar,private loginService:DataService) {}
pendingOrders:any[]=[]
pendingOrdersData:any[]=[]


ngOnInit(): void {
  this.dataService.getPendingOrders().subscribe(
     (result: any[]) => {
      console.log(result)
      this.pendingOrdersData = result;
      console.log(this.pendingOrdersData)
});
}

  showSnackBar(message:string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000, 
    });
  }
  approveOrder(orderId:number){
  this.dataService.apporvePendingOrder(orderId).subscribe(result=>{
    this.loginService.addTransaction("Put","Approved an order. Order ID:"+orderId)
    console.log(result)
    location.reload()
  },
(error:HttpErrorResponse)=>
{
  this.showSnackBar(error.error)
}
)
  }
  rejectOrder(orderId:number){
    this.dataService.dissaprovePendingOrders(orderId).subscribe(result=>{
      this.loginService.addTransaction("Put","Rejected an order. Order ID:"+orderId)
      console.log(result)
      location.reload()
    })
   
    }

}
