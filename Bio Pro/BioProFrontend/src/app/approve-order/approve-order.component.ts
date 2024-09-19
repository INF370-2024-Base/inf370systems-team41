import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console, error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../services/login.service';
import { DecisionViewModel } from '../shared/ordersViewModel';
import { MatDialog } from '@angular/material/dialog';
import { RejectOrderModalComponent } from '../reject-order-modal/reject-order-modal.component';

@Component({
  selector: 'app-approve-order',
  templateUrl: './approve-order.component.html',
  styleUrls: ['./approve-order.component.scss']
})
export class ApproveOrderComponent implements OnInit {

  constructor( private dataService: OrderService,private snackBar: MatSnackBar,private loginService:DataService,private dialog: MatDialog) {}
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
    const Decision:DecisionViewModel={
      Justification:"Order approved",
      DateOfDecision:new Date(),
      DecisionLogState:"Accepted",
      SystemOrderId:orderId
    }
    this.dataService.AddDecision(Decision).subscribe(
      result=>{
        console.log("Successfully added decision")
      },
      error=>{
        console.log("Error:"+error.error)
      }
    )
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
   
     const dialogRef = this.dialog.open(RejectOrderModalComponent, {
      width: '300px',
      data: { orderId: orderId }
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        location.reload();
      }
    });
  }
}

