import { Component, OnInit } from '@angular/core';
import { OrderService } from './services/order.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DataService } from './services/login.service';
import { AddAuditTrailViewModels } from './shared/addAuditTrailViewModel';
import { LoadingService } from './services/loading.service';
import { RoleGuardService } from './services/roleCheck';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isSidenavOpen = true;
  isEmployeeMenuOpen = false;
  isOrdersMenuOpen = false;
  isDeliveriesMenuOpen = false;
  isStockMenuOpen = false;
  isUserSubNavOpen = false;
  loading$ = this.loadingService.loading$;
  isLoggedIn = false;
  user: any;
  showNavBar = true;
  title = 'BioProSystem';
  userRoles: string[] = [];
  pendingOrdersCount: number = 0;
  ordersAwaitingDentalDesignCount: number = 0;
  ordersAwaitingDesignApprovalCount: number = 0;

  constructor(public dataService: OrderService, private router: Router, private dialog: MatDialog,private loadingService:LoadingService,public  roleService: RoleGuardService,private loginService:DataService) {
    // Listen to router events to determine the current route
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('User')!);
    this.isLoggedIn = sessionStorage.getItem('Token') != undefined || sessionStorage.getItem('User') != null;

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
    if(this.roleService.hasRole(['Lab Manager', 'Owner'])){
    this.loadPendingOrders();};
    if(this.roleService.hasRole(['Owner','Design Technician'])){
    this.loadOrdersAwaitingDentalDesign();};
    if(this.roleService.hasRole([' Admin', 'Owner', 'Lab Manager'])){
    this.loadOrdersAwaitingDesignApproval();};
  }
  loadPendingOrders(): void {
    this.dataService.getPendingOrders().subscribe((orders: any[]) => {
      this.pendingOrdersCount = orders.length;
    });
  }
    // Load count of orders awaiting dental design
    loadOrdersAwaitingDentalDesign(): void {
      this.dataService.getOrdersAwaitingDentalDesign().subscribe((orders: any[]) => {
        this.ordersAwaitingDentalDesignCount = orders.length;
      });
    }
  
    // Load count of orders awaiting dental design approval
    loadOrdersAwaitingDesignApproval(): void {
      this.dataService.GetOrdersAwaitingDentalDesignApproval().subscribe((orders: any[]) => {
        this.ordersAwaitingDesignApprovalCount = orders.length;
      });
    }
  
  toggleOrdersMenu(): void {
    this.isOrdersMenuOpen = !this.isOrdersMenuOpen;
  }

  toggleSubNav(nav: string): void {
    this.isUserSubNavOpen = !this.isUserSubNavOpen;
  }

  toggleEmployeeMenu() {
    this.isEmployeeMenuOpen = !this.isEmployeeMenuOpen;
  }

  toggleDeliveriesMenu() {
    this.isDeliveriesMenuOpen = !this.isDeliveriesMenuOpen;
  }

  toggleStockMenu() {
    this.isStockMenuOpen = !this.isStockMenuOpen;
  }

  getSignInUser() {
    this.user = JSON.parse(sessionStorage.getItem('User')!);
    this.isLoggedIn = sessionStorage.getItem('User') != undefined || sessionStorage.getItem('User') != null;
  }

  signOut() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to sign out?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loginService.addTransaction("Put","Logged out.")
        this.router.navigate(['login']);
      }
    });
  }
  
}
