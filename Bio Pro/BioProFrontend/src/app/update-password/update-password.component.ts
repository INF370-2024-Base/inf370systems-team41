import { Component, OnInit } from '@angular/core';
import { UpdateUser } from '../shared/UpdateUser';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServices } from '../services/user.service';
import { ResetPassword } from '../shared/UpdateUser';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  updatePassword:FormGroup;
  constructor(private route: ActivatedRoute,private fb: FormBuilder,private userService:UserServices,private snackBar:MatSnackBar,
    private router:Router) {this.updatePassword = this.fb.group({
      OldPassword: ['', [Validators.required]],
    Password: ['', [Validators.required, this.passwordValidator(), Validators.minLength(6)]],
      ConfirmPassword: ['', [Validators.required, this.passwordMatchValidator]]});}
  toEmail:string=''
  ngOnInit(): void {
    this.toEmail=JSON.parse(sessionStorage.getItem('User')!).email
    console.log(this.toEmail)
  }
  onSave() {
    if (this.updatePassword.valid) {
      
      const Password = this.updatePassword.value.Password;
      const OldPassword = this.updatePassword.value.OldPassword;
      const userToUpdate:UpdateUser={
        UserEmail:this.toEmail,
        NewPassword:Password,
        OldPassword:OldPassword
      }
      console.log(this.updatePassword.value.Email)
      this.userService.UpdatePassword(userToUpdate).subscribe(result=>{
        this.snackBar.open('Password updated!', 'Close', {
          duration: 2000,
        });
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
