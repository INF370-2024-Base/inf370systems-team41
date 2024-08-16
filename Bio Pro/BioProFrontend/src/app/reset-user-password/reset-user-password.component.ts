import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServices } from '../services/user.service';
import { ResetPassword } from '../shared/UpdateUser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddAuditTrailViewModels } from '../shared/addAuditTrailViewModel';

import { DataService } from '../services/login.service';

@Component({
  selector: 'app-reset-user-password',
  templateUrl: './reset-user-password.component.html',
  styleUrls: ['./reset-user-password.component.scss']
})
export class ResetUserPasswordComponent implements OnInit {
  resetPasswordForm:FormGroup;
  constructor(private route: ActivatedRoute,private fb: FormBuilder,private userService:UserServices,private loginService:DataService,private snackBar:MatSnackBar,
    private router:Router) {this.resetPasswordForm = this.fb.group({
      Password: ['', [Validators.required, this.passwordValidator(), Validators.minLength(6)]],
      ConfirmPassword: ['', [Validators.required, this.passwordMatchValidator]]});}
  toEmail:string=''
  ngOnInit(): void {const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.toEmail = email;
    }
    console.log(this.toEmail)
  }
  onSave() {
    if (this.resetPasswordForm.valid) {
      
      const Password = this.resetPasswordForm.value.Password;
      const userToUpdate:ResetPassword={
        UserEmail:this.toEmail,
        NewPassword:Password
      }
      console.log(this.resetPasswordForm.value.Email)
      this.userService.ResetUserPassword(userToUpdate).subscribe(result=>{
        this.snackBar.open('Password was reset', 'Close', {
          duration: 2000,
        });
        const signedInUser=JSON.parse(sessionStorage.getItem('User')!)
        const id=signedInUser.id
       const transaction:AddAuditTrailViewModels={
         AdditionalData:userToUpdate.UserEmail+" reset their password",
         DateOfTransaction:new Date,
         TransactionType:"Put",
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
      },error=>
      {
        console.error('Error updating stock category:', error);
          this.snackBar.open(error.error, 'Close', {
            duration: 2000,
          });
        
      })
    }
    
  }
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const uppercasePattern = /[A-Z]/;
      const specialCharacterPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  
      if (!uppercasePattern.test(value) || !specialCharacterPattern.test(value)) {
        return { 'invalidPassword': true };
      }
      return null;
    };
  }
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control.parent;
    if (!formGroup) {
      return null;
    }
  
    const password = formGroup.get('Password');
    if (password && control.value !== password.value) {
      return { 'mismatch': true }; 
    }
  
    return null;
  }
  
  onCancel() {
    this.router.navigate(['login']);
  }

}
