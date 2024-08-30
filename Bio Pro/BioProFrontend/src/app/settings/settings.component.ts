import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/login.service';
import { UserServices } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { EditUser } from '../shared/EditUser';
import { PhoneChecker } from '../validators/Validators';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  userForm: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private dataService: DataService,
    private userService: UserServices,
    private dialog:MatDialog,
    private fb: FormBuilder,private loginService:DataService
  ) {
    this.userForm = this.fb.group({
      Name: ['', Validators.required],
      Surname: ['', Validators.required],
      EmailAddress: ['', [Validators.required, Validators.email]],
      Phonenumber: ['', [Validators.required, PhoneChecker.SouthAfricanPhoneNumberValidator()]]
    });
  }

  ngOnInit(): void {
    // Load user data if needed
    this.loadUserSettings();
  }
   userDetails = JSON.parse(sessionStorage.getItem('User')!);
     user:EditUser={
      Name:this.userDetails.name,
      Surname:this.userDetails.surname,
      OldEmail:this.userDetails.email,
      UpdatedEmail:this.userDetails.email,
      Phonenumber:this.userDetails.phoneNumber
    }

  loadUserSettings(){
    
    this.userForm.patchValue({
      Name: this.user.Name,
      Surname:this.user.Surname,
      EmailAddress: this.user.UpdatedEmail,
      Phonenumber:this.user.Phonenumber
    });
  }
  saveSettings(): void {
    if (this.userForm.valid) {
      const user:EditUser={
        Name:this.userForm.value.Name,
        Surname:this.userForm.value.Surname,
        OldEmail:this.user.OldEmail,
        UpdatedEmail:this.userForm.value.EmailAddress,
        Phonenumber:this.userForm.value.Phonenumber
      }
      if(deepEqual(user, this.user))
        {
         this.snackBar.open('No values changed', 'Close', {
           duration: 3000
         });
        }
        else{
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '250px',
            data: 'Are you sure you want to change your details'
          });
          console.log(this.user)
          console.log(user)
       
            dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.userService.UpdateUser(user).subscribe(
                () => {
                  
                  this.snackBar.open('Settings saved successfully!', 'Close', {
                    duration: 3000
                  });
                  this.loginService.addTransaction("Put","Changed their user details.")
                  this.router.navigate(['login']);
                },
                (error: HttpErrorResponse) => {
                  this.snackBar.open('Failed to save settings.'+error, 'Close', {
                    duration: 3000
                  });
                  console.log(error.error)
                }
                
              );
            } else {
              this.snackBar.open('Please correct the errors in the form.', 'Close', {
                duration: 3000
              });
            }
          });
         } 
        }
       
    }
  
}
function deepEqual(obj1: any, obj2: any): boolean {
  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if both objects have the same number of keys
  if (keys1.length !== keys2.length) return false;

  // Check if all keys and values are equal
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}
