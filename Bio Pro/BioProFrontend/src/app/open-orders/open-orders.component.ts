import { Component, OnInit } from '@angular/core';
import { OpenOrder } from '../shared/openorder';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {
  OpenOrders:OpenOrder[] = []
  constructor(private dataService: OrderService,private router: Router) { }

  ngOnInit(): void {
    this.GetOpenOrder()
    console.log(this.OpenOrders)
  }

  GetOpenOrder()
  {
    this.dataService.getOpenOrders().subscribe(result => {
      let courseList:any[] = result
      courseList.forEach((element) => {
        this.OpenOrders.push(element)
      });
    })
    console.log(this.OpenOrders);
    
  }

}
