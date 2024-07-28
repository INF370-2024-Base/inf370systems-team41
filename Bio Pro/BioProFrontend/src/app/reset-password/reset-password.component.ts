import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServices } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
resetPasswordForm:FormGroup;
  constructor(public dialogRef: MatDialogRef<ResetPasswordComponent>,private fb: FormBuilder,private userService:UserServices,private snackBar:MatSnackBar) {this.resetPasswordForm = this.fb.group({
    Email: ['', [Validators.required, Validators.email]]
  });  }

  ngOnInit(): void {
  }
  onSave() {
    if (this.resetPasswordForm.valid) {
      
      const email = this.resetPasswordForm.value.Email;
      console.log(this.resetPasswordForm.value.Email)
      this.userService.SendResetPasswordEmail(email).subscribe(result=>{
        this.snackBar.open('Reset link sent', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close(true);
      },error=>
      {
        console.error('Error updating stock category:', error);
          this.snackBar.open(error.error, 'Close', {
            duration: 2000,
          });
        
      })
    }
  }
  onCancel() {
    this.dialogRef.close(false);
  }
}
