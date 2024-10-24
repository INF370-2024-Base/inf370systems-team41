import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { RoleGuardService } from '../services/roleCheck';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('1s', style({ transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  weather: any;
  pendingOrdersCount: number = 0;
  ordersAwaitingDentalDesignCount: number = 0;
  approveDentalDesignCount: number = 0;

  frequentlyVisitedPages: { name: string; route: string; icon: string,roles:string[]}[] = [
    { name: 'NEW ORDER', route: '/addOrder', icon: 'assignment',roles:['Lab Manager','Owner','Admin'] },
    { name: 'ALL ORDERS', route: '/orders', icon: 'folder_open',roles:['Lab Manager','Owner','Admin','Employee','Design Technician'] },
    { name: 'VIEW CALENDAR', route: '/calendar', icon: 'calendar_today',roles:['Lab Manager','Owner','Admin','Employee','Design Technician'] },
    { name: 'DELIVERIES MANAGEMENT', route: '/deliveries', icon: 'delivery_dining',roles:['Lab Manager','Owner','Admin'] },
    { name: 'STOCK MANAGEMENT', route: '/pageStock', icon: 'stock',roles:['Lab Manager','Owner','Admin','Employee','Design Technician'] },
    { name: 'REPORTS', route: '/reports', icon: 'analytics',roles:['Lab Manager','Owner','Admin'] },
    { name: 'APPROVE ORDER', route: '/approval', icon: 'analytics',roles:['Owner','Lab Manager'] },
    { name: 'AWAITING DENTAL DESIGN', route: '/orderAwaitingDentalDesign', icon: 'folder_open',roles:['Lab Manager','Design Technician'] },
    { name: 'APPROVE DENTAL DESIGN', route: '/dentalDesignApproval', icon: 'add_circle_outline',roles:['Lab Manager','Owner'] },
  ];

  constructor(private http: HttpClient,public roleService: RoleGuardService,private dataService: OrderService) {}

  ngOnInit(): void {
    this.getWeather();
    this.frequentlyVisitedPages=this.getFilteredPages();
    if(this.roleService.hasRole(['Lab Manager', 'Owner'])){
      this.loadPendingOrders();};
      if(this.roleService.hasRole(['Owner','Design Technician'])){
      this.loadOrdersAwaitingDentalDesign();};
      if(this.roleService.hasRole([' Admin', 'Owner', 'Lab Manager'])){
      this.loadOrdersAwaitingDesignApproval();};
  }

  getWeather(): void {
    const apiKey = ' 5bca8bbec1f34810b19221045241807'; // Trail ends  1 Aug 
    const city = 'Pretoria';
    this.http
      .get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
      .subscribe((data) => (this.weather = data));
  }
  
  openModal(): void {
    // Logic to open modal
    const modal = document.getElementById("thankYouModal");
    if (modal) {
      modal.style.display = "block";
    }
  }
  getFilteredPages() {
    return this.frequentlyVisitedPages.filter(page => this.roleService.hasRole(page.roles));
  }

  closeModal(): void {
    // Logic to close modal
    const modal = document.getElementById("thankYouModal");
    if (modal) {
      modal.style.display = "none";
    }
  }
  loadOrderCounts(): void {
    // Fetch pending order counts
    this.dataService.getPendingOrdersCount().subscribe((orders: any) => {
      this.pendingOrdersCount = orders;
    });

    this.dataService.getOrdersAwaitingDentalDesign().subscribe((orders: any[]) => {
      this.ordersAwaitingDentalDesignCount = orders.length;
    });

    this.dataService.GetOrdersAwaitingDentalDesignApprovalCount().subscribe((orders: any) => {
      this.approveDentalDesignCount = orders;
    });
  }
// Load order counts
loadPendingOrders(): void {
  this.dataService.getPendingOrdersCount().subscribe((orders: any) => {
    this.pendingOrdersCount = orders;
  });
}

loadOrdersAwaitingDentalDesign(): void {
  this.dataService.getOrdersAwaitingDentalDesign().subscribe((orders: any[]) => {
    this.ordersAwaitingDentalDesignCount = orders.length;
  });
}

loadOrdersAwaitingDesignApproval(): void {
  this.dataService.GetOrdersAwaitingDentalDesignApprovalCount().subscribe((orders: any) => {
    this.approveDentalDesignCount = orders;
  });
}
 // Add the getBadgeCount method
 getBadgeCount(page: any): number {
  if (page.name === 'APPROVE ORDER') {
    return this.pendingOrdersCount;
  } else if (page.name === 'AWAITING DENTAL DESIGN') {
    return this.ordersAwaitingDentalDesignCount;
  } else if (page.name === 'APPROVE DENTAL DESIGN') {
    return this.approveDentalDesignCount;
  } else {
    return 0;
  }
}
}