import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleGuardService } from '../services/roleCheck';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  userForm: FormGroup;
  auditTrail: any[] = [];
  filteredAuditTrails = new MatTableDataSource<any>();
  currentView:string="User Profile"
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [ 'dateOfTransaction', 'systemUser', 'transactionType', 'additionalData'];

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedUserEmail: string | null = null;
  selectedTransactionType: string | null = null;
today:Date=new Date()
  uniqueUsers: any[] = [];
  uniqueTransactionTypes: string[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private dataService: DataService,
    private userService: UserServices,
    private dialog:MatDialog,
    private fb: FormBuilder,private loginService:DataService,public roleService:RoleGuardService
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
    changeSettings(event:any)
    {
      if(event.value=="Audit"){
      if(this.roleService.hasRole(['Lab Manager','Owner']))
        {
          this.loginService.GetAllTransaction().subscribe(
            (result: any[]) => {
              this.auditTrail = result.map(item => {
                // Convert date string to Date object if not already
                const date = new Date(item.dateOfTransaction);
      
                // Adjust for time zone difference (e.g., GMT+2, which is 120 minutes ahead of GMT)
                // Replace `120` with the appropriate offset for your needs
                const offsetMinutes = 120;
                date.setMinutes(date.getMinutes() + offsetMinutes);
      
                item.dateOfTransaction = date; // Update with adjusted date
                return item;
              });
              this.filteredAuditTrails.data = this.auditTrail;
              this.filteredAuditTrails.sort = this.sort;
              console.log(this.filteredAuditTrails.data)
              this.extractUniqueValues();
            },
            (error) => {
              this.showSnackBar("Failed to load audit trails. Please contact admin. " + error.error);
            }
          );
        }
      }
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
    extractUniqueValues() {
      const uniqueUserEmails = new Set();
      this.uniqueUsers = this.auditTrail
        .filter(item => {
          if (uniqueUserEmails.has(item.systemUser.email)) {
            return false;
          } else {
            uniqueUserEmails.add(item.systemUser.email);
            return true;
          }
        })
        .map(item => ({
          email: item.systemUser.email,
          name: item.systemUser.name,
          surname: item.systemUser.surname
        }));
  
      this.uniqueTransactionTypes = [...new Set(this.auditTrail.map(item => item.transactionType))];
    }
  
    applyFilters() {
      console.log(this.startDate)
      this.filteredAuditTrails.data = this.auditTrail.filter(item => {
        const matchesDateRange = (!this.startDate || new Date(item.dateOfTransaction) > this.startDate) &&
                                 (!this.endDate || new Date(item.dateOfTransaction) < this.endDate);
        const matchesUser = !this.selectedUserEmail || item.systemUser.email === this.selectedUserEmail;
        const matchesTransactionType = !this.selectedTransactionType || item.transactionType === this.selectedTransactionType;
  
        return matchesDateRange && matchesUser && matchesTransactionType;
      });
    }
  
    clearFilters() {
      this.startDate = null;
      this.endDate = null;
      this.selectedUserEmail = null;
      this.selectedTransactionType = null;
      this.filteredAuditTrails.data = this.auditTrail;
    }
  
    onStartDateChange(event: any) {
      console.log('is today')
      if (this.endDate && this.startDate && new Date(this.startDate) > new Date(this.endDate)) {
        this.endDate = this.startDate;
        if(this.startDate==this.today)
        {
          
          this.endDate=this.today
        }
        this.applyFilters();
      }
    }
  
    onEndDateChange(event: any) {
      if (this.startDate && this.endDate && new Date(this.endDate) < new Date(this.startDate)) {
        this.startDate = this.endDate;
        this.applyFilters();
      }
    }
  
    addDays(date: Date, days: number): Date {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  
    showSnackBar(message: string) {
      this.snackBar.open(message, 'Dismiss', {
        duration: 3000,
      });
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
