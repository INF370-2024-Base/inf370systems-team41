import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-dental-design-approval',
  templateUrl: './dental-design-approval.component.html',
  styleUrls: ['./dental-design-approval.component.scss']
})
export class DentalDesignApprovalComponent implements OnInit {

  constructor(private snackBar:MatSnackBar,private orderService:OrderService) { }
  pendingOrdersData:any[]=[]
  ngOnInit(): void {
      this.orderService.GetOrdersAwaitingDentalDesignApproval().subscribe(
        result=>
          {
            this.pendingOrdersData=result
            console.log(this.pendingOrdersData)
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
  approveOrder(orderId:number){
    this.orderService.apporveDentalDesign(orderId).subscribe(result=>{
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
      this.orderService.rejectDentalDesign(orderId).subscribe(result=>{
        console.log(result)
        location.reload()
      })
     
      }

}
