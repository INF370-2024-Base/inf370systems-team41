import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServices } from '../services/user.service';
import { UpdateUser } from '../shared/UpdateUser';
import { AddAuditTrailViewModels } from '../shared/AddAuditTrailViewModel';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit, OnDestroy, AfterViewInit {
  updatePassword: FormGroup;
  timeLeft: number = 60; // 1.5 minutes
  lockDuration: number = 300; // 5 minutes
  isLocked: boolean = false;
  intervalId: any;
  timerStarted: boolean = false;
  toEmail: string = '';

  @ViewChild('oldPasswordInput') oldPasswordInput: ElementRef | undefined;
  @ViewChild('newPasswordInput') newPasswordInput: ElementRef | undefined;
  @ViewChild('confirmPasswordInput') confirmPasswordInput: ElementRef | undefined;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private userService: UserServices,private loginService: DataService, private snackBar: MatSnackBar,
    private router: Router) {
    this.updatePassword = this.fb.group({
      OldPassword: ['', [Validators.required]],
      Password: ['', [Validators.required, this.passwordValidator(), Validators.minLength(6)]],
      ConfirmPassword: ['', [Validators.required, this.passwordMatchValidator]]
    });
  }

  ngOnInit(): void {
    this.toEmail = JSON.parse(sessionStorage.getItem('User')!).email;
    console.log(this.toEmail);
  }

  ngAfterViewInit(): void {
    if (this.oldPasswordInput) {
      this.oldPasswordInput.nativeElement.addEventListener('focus', () => this.onFocus());
    }
    if (this.newPasswordInput) {
      this.newPasswordInput.nativeElement.addEventListener('focus', () => this.onFocus());
    }
    if (this.confirmPasswordInput) {
      this.confirmPasswordInput.nativeElement.addEventListener('focus', () => this.onFocus());
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  onFocus(): void {
    if (!this.timerStarted) {
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timerStarted = true;
    this.clearTimers();
    this.intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        console.log(`Time left: ${this.timeLeft}`);
      } else {
        this.lockForm();
      }
    }, 1000);
  }

  clearTimers(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  lockForm(): void {
    this.isLocked = true;
    this.clearTimers();
    this.snackBar.open('Time expired! Form is locked for 5 minutes.', 'Close', {
      duration: 3000,
    });

    setTimeout(() => {
      this.isLocked = false;
      this.timeLeft = 90;
      this.timerStarted = false;
    }, this.lockDuration * 1000);
  }

  onSave() {
    if (this.updatePassword.valid) {
      const Password = this.updatePassword.value.Password;
      const OldPassword = this.updatePassword.value.OldPassword;
      const userToUpdate: UpdateUser = {
        UserEmail: this.toEmail,
        NewPassword: Password,
        OldPassword: OldPassword
      };
      this.userService.UpdatePassword(userToUpdate).subscribe(result => {
        this.snackBar.open('Password updated!', 'Close', {
          duration: 2000,
        });
        const signedInUser=JSON.parse(sessionStorage.getItem('User')!)
        const id=signedInUser.id
       const transaction:AddAuditTrailViewModels={
         AdditionalData:"Updated their password",
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
        this.router.navigate(['login']);
      }, error => {
        console.error('Error updating password:', error);
        this.snackBar.open(error.error, 'Close', {
          duration: 2000,
        });
      });
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
