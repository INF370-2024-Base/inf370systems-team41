import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-approve-order',
  templateUrl: './approve-order.component.html',
  styleUrls: ['./approve-order.component.scss']
})
export class ApproveOrderComponent implements OnInit {

  constructor( private dataService: DataService,private snackBar: MatSnackBar) {}
pendingOrders:any[]=[]


  ngOnInit(): void {
    this.dataService.getPendingOrders().subscribe(
      (result: any[]) => {
          result.forEach((element) => {
            this.pendingOrders.push(element);
          });
      }
      ,(error) => {
        this.showSnackBar()
      }
    );
    console.log( this.pendingOrders)
  }
  showSnackBar() {
    this.snackBar.open('No pending orders found.', 'Dismiss', {
      duration: 3000, 
    });
  }
  approveOrder(orderId:number){
  this.dataService.apporvePendingOrder(orderId).subscribe(result=>{
    console.log(result)
    location.reload()
  })
  }
  dissaproveOrder(orderId:number){
    this.dataService.dissaprovePendingOrders(orderId).subscribe(result=>{
      console.log(result)
      location.reload()
    })
   
    }

}
