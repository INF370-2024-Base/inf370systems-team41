import { Component } from '@angular/core';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidenavOpen = true;
  isEmployeeMenuOpen = false;
  isOrdersMenuOpen = false;
  isDeliveriesMenuOpen = false;
  title = 'BioProSystem';
  toggleOrdersMenu(): void {
    this.isOrdersMenuOpen = !this.isOrdersMenuOpen;
  }
  toggleEmployeeMenu() {
    this.isEmployeeMenuOpen = !this.isEmployeeMenuOpen;
  }
  toggleDeliveriesMenu()
  {
    this.isDeliveriesMenuOpen = !this.isDeliveriesMenuOpen;
  }
  isLoggedIn = false;
  user:any;
  constructor(public dataService:OrderService) {}
  isSignedIn:boolean=false
  ngOnInit() {
    this.user=JSON.parse(sessionStorage.getItem('User')!)
    this.isLoggedIn=sessionStorage.getItem('Token')!=undefined||sessionStorage.getItem('User')!=null
    };
    getSignInUser()
    {
      this.user=JSON.parse(sessionStorage.getItem('User')!)
      this.isLoggedIn=sessionStorage.getItem('User')!=undefined ||sessionStorage.getItem('User')!=null
    }

}
