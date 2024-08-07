import { Component } from '@angular/core';
import { OrderService } from './services/order.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DataService } from './services/login.service';
import { AddAuditTrailViewModel } from './shared/AddAuditTrailViewModel';

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
  isStockMenuOpen = false;
  isUserSubNavOpen = false;
  
  title = 'BioProSystem';
  toggleOrdersMenu(): void {
    this.isOrdersMenuOpen = !this.isOrdersMenuOpen;
  }
  toggleSubNav(nav: string): void {
    
      this.isUserSubNavOpen = !this.isUserSubNavOpen;
    }
    
  toggleEmployeeMenu() {
    this.isEmployeeMenuOpen = !this.isEmployeeMenuOpen;
  }
  toggleDeliveriesMenu()
  {
    this.isDeliveriesMenuOpen = !this.isDeliveriesMenuOpen;
  }
  toggleStockMenu()
  {
    this.isStockMenuOpen = !this.isStockMenuOpen;
  }
  isLoggedIn = false;
  user:any;
  constructor(public dataService:OrderService,public loginService:DataService,private router:Router,private dialog:MatDialog) {}
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
    signOut(){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: 'Are you sure you want to sign out?'
      });
     
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const signedInUser=JSON.parse(sessionStorage.getItem('User')!)
          const id=signedInUser.id
         const transaction:AddAuditTrailViewModel={
           AdditionalData:"Logged out",
           DateOfTransaction:new Date,
           TransactionType:"Post",
           SystemUserId:id
         }
         console.log(transaction)
         this.loginService.CreateTransaction(transaction).subscribe(
           result=>{
             console.log("Successfully added transaction.")
             console.log(result)
           }
           ,
           error=>{
             console.log("Unable to add transaction.")
             console.log(error.error)
           }
         )
          this.router.navigate(['login'])
        }
      });
    }
}
