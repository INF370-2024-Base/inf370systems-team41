import { Component, OnInit } from '@angular/core';
import { OpenOrder } from '../shared/openorder';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss'],
  animations: [
    trigger('cardHover', [
      state('hover', style({
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      })),
      state('rest', style({
        transform: 'scale(1)',
        boxShadow: 'none',
      })),
      transition('rest <=> hover', animate('300ms ease-in-out')),
    ])
  ]
})

export class OpenOrdersComponent implements OnInit {
  OpenOrders:OpenOrder[] = []
  constructor(private dataService: OrderService,private router: Router) { }

  hoverState: string = 'rest';

  toggleHover(state: string) {
    this.hoverState = state;
  }

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
