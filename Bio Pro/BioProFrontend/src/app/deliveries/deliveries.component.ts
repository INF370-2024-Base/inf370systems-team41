import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../services/deliver.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  constructor(private deliveryService:DeliveryService) { }

  ngOnInit(): void {
    this.getDeliveries()
  }
  deliveries:any
 getDeliveries()
 {
  this.deliveryService.getdeliveries().subscribe(results=>
    {
      this.deliveries=results
      console.log(this.deliveries)
    },
    (error:HttpErrorResponse)=>
    {
      console.log(error)
    }
  )
 }
}
