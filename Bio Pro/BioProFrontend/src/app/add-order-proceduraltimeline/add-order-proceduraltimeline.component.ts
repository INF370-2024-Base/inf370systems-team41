import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProceduralTimelineViewModel } from '../shared/proceduralTimelineViewModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProceduralTimelineService } from '../services/proceduraltimeline.services';

@Component({
  selector: 'app-add-order-proceduraltimeline',
  templateUrl: './add-order-proceduraltimeline.component.html',
  styleUrls: ['./add-order-proceduraltimeline.component.scss']
})
export class AddProceduralTimeline implements OnInit {
  timelineForm: FormGroup;
  proceduralTimeline: ProceduralTimelineViewModel = {
    OrderIds: [],
    TimelineDetail: ''
  };
  orders: any;
  systemOrderIds: number[] = [];
  orderInfo: any[] = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private timelineServices: ProceduralTimelineService
  ) {
    this.timelineForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getsystemOrders();
  }

  getsystemOrders() {
    this.orderService.getOrdersWithNoTimelineAndInProgress().subscribe(results => {
      this.orders = results;
      results.forEach(element => {
        this.orderService.getAllOrderInfo(element.orderId).subscribe(results => {
          this.orderInfo.push(results);
          console.log(this.orderInfo);
        });
      });
    }, (error: HttpErrorResponse) => console.log(error));
  }

  toggleOrderSelection(order: any) {
    const orderId = order.systemOrder.orderId;
    const isSelected = this.systemOrderIds.includes(orderId);

    if (isSelected) {
      // Remove the order ID from the array if checkbox is deselected
      this.systemOrderIds = this.systemOrderIds.filter(id => id !== orderId);
    } else {
      // Add the order ID to the array if checkbox is selected
      this.systemOrderIds.push(orderId);
    }
    console.log('Selected Order IDs:', this.systemOrderIds);
  }

  onSubmit() {
    if (this.timelineForm.invalid ) {
      this.showSnackbar('Please check the form.');
      
    }
    else{
      if(this.systemOrderIds.length > 0)
        {
          this.proceduralTimeline.OrderIds = this.systemOrderIds;
          this.proceduralTimeline.TimelineDetail = this.timelineForm.value.description;
          this.timelineServices.addOrder(this.proceduralTimeline).subscribe(result=>
            {
              console.log(result)
            },
            (error: HttpErrorResponse) => console.log(error)
          )

        }
        else{
          this.showSnackbar('Please select atleast one order.');
        }
    }

    

  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000 // milliseconds
    });
  }
}