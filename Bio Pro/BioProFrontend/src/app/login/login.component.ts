import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/login.service';
import { SystemUser } from '../shared/systemuser';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServices } from '../services/user.service';
import { EditUser } from '../shared/EditUser';
import { error } from 'console';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddAuditTrailViewModels } from '../shared/addAuditTrailViewModel';
import { RoleGuardService } from '../services/roleCheck';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMessage: string = ''; 

  constructor(private snackBar:MatSnackBar, private router: Router, private dataService: DataService,private appComponent:AppComponent,private userService:UserServices,private dialog: MatDialog,private roleService:RoleGuardService) { }

  
  user:SystemUser={
    EmailAddress:"",
    Password:"",
  }

  onSubmit() {

    sessionStorage.removeItem('Token')
    sessionStorage.removeItem('User')
    this.appComponent.getSignInUser();
    this.dataService.Login(this.user)
      .subscribe(
        (result: any) => {          
          sessionStorage.setItem('Token', JSON.stringify(result));
          
          this.dataService.Login
          this.checkSignInStatusAndNavigate(); 
        },
        (error) => {
          console.log(error)
          if(error=="Invalid login credentials")
          {
            alert(error)
          }
          
        }
      );
  }

  private checkSignInStatusAndNavigate() {
    this.dataService.checkSignInStatus()
      .subscribe(() => {
        const userInSession = sessionStorage.getItem('User');
        if (userInSession) {
          const signedInUser = JSON.parse(userInSession);
          const id = signedInUser.id;
          const transaction: AddAuditTrailViewModels = {
            AdditionalData: "Logged in",
            DateOfTransaction: new Date(),
            TransactionType: "Post",
            SystemUserId: id
          };
  
          console.log(transaction);
  
          // Create the transaction
          this.dataService.CreateTransaction(transaction).subscribe(
            result => {
              this.roleService.loadRoles();
              console.log(this.roleService.getRoles())
              this.router.navigate(['/home']);
              this.appComponent.getSignInUser(); 
              console.log("Successfully added transaction: " + result);
            },
            error => {
              this.roleService.loadRoles();
              console.log(this.roleService.getRoles())
              this.router.navigate(['/home']);
              this.appComponent.getSignInUser(); 
              console.log("Unable to add transaction: " + error.error);
            }
          );
        }
      });
  }
  



  ngOnInit(): void {
    sessionStorage.removeItem('Token')
    sessionStorage.removeItem('User')
    this.appComponent.getSignInUser()
  }
  
resetpassword(){
  console.log("now")
  const dialogRef = this.dialog.open(ResetPasswordComponent, {
    width: '400px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.snackBar.open('Reset password sent', 'Close', {
        duration: 3000,
      });
    }
  });
}
}
