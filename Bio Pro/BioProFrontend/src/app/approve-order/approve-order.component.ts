import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-approve-order',
  templateUrl: './approve-order.component.html',
  styleUrls: ['./approve-order.component.scss']
})
export class ApproveOrderComponent implements OnInit {

  constructor( private dataService: OrderService,private snackBar: MatSnackBar) {}
pendingOrders:any[]=[]
pendingOrdersData:any[]=[]


ngOnInit(): void {
  this.dataService.getPendingOrders().subscribe(
    async (result: any[]) => {
      this.pendingOrders = result;
      this.pendingOrdersData = [];

      for (const element of this.pendingOrders) {
        const results = await this.dataService.getAllOrderInfo(element.orderId).toPromise();
        this.pendingOrdersData.push(results);
        console.log(this.pendingOrdersData);
      }
    },
    (error) => {
      this.showSnackBar("No pending orders found.");
    }
  );
}

  showSnackBar(message:string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000, 
    });
  }
  approveOrder(orderId:number){
  this.dataService.apporvePendingOrder(orderId).subscribe(result=>{
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
      console.log(result)
      location.reload()
    })
   
    }

}
