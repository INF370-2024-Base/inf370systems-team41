import { Component } from '@angular/core';
import { DataService } from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidenavOpen = true;
  isOrdersMenuOpen = false;
  title = 'BioProSystem';
  toggleOrdersMenu(): void {
    this.isOrdersMenuOpen = !this.isOrdersMenuOpen;
  }
  isLoggedIn = false;
  user:any;
  constructor(public dataService:DataService) {}
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
