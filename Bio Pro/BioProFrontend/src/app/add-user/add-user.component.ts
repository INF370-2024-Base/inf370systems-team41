import { Component, OnInit } from '@angular/core';
import { UserServices } from '../services/user.service';
import { addUser } from '../shared/adduser';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { addEmployee } from '../shared/addEmployee';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../shared/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { PhoneChecker } from '../validators/Validators';
import { Router } from '@angular/router';
import { AddAuditTrailViewModels } from '../shared/addAuditTrailViewModel';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private router: Router,private userServices:UserServices,private loginService:DataService,private fb: FormBuilder,private employeeService:EmployeeService) {this.userForm = this.fb.group({
    surname: ['', Validators.required],
    name: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6),this.passwordValidator()]],
    phoneNumber: ['', [Validators.required,PhoneChecker.SouthAfricanPhoneNumberValidator()]],
    rolename:['', Validators.required]
  }),this.employeeform = this.fb.group({
    JobTitleId: ['', Validators.required],
    Address: ['', [Validators.required]],
  });
}
UserRoles:any
isEmployee:boolean=false
jobtitles:any[]=[]
newUser:addUser={
  surname:"",
  name:"",
  emailaddress:"",
  password:"",
  phonenumber:"",
  rolename:""
}
newEmployee:addEmployee={
  JobTitleId: 0,
  EmailAddress: "",
  Address: "",
  PhoneNumber:""
}
userForm: FormGroup;
employeeform:FormGroup;

openSnackBar(message: string, error?: any) {
  let fullMessage = message;

  if (error) {
    if (Array.isArray(error)) {
      // If error is an array, iterate through it and append each error's description
      error.forEach((err: any) => {
        if (err.description) {
          fullMessage += `\n${err.description}`;
        }
      });
    } else if (error.description) {
      // If error is a single object with a description
      fullMessage += `: ${error.description}`;
    }
  }

  this.snackBar.open(fullMessage, 'Close', {
    duration: 5000, // Duration in milliseconds
  });
}


  ngOnInit(): void {
    this.getAllRoles();
    this.getJobtitles();
    
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
  getAllRoles()
  {
    this.userServices.getRoles().subscribe(roles=>{
      this.UserRoles=roles
      console.log(this.UserRoles)
    },
  (error)=>
   {
  console.log(error)
    }
  )
  }
  getJobtitles()
  {
   this.employeeService.getJobtitles().subscribe(results=>{
    this.jobtitles=results
    console.log(this.jobtitles)
   },
  error=>
  {
    console.log(error)
  })
  }
  toggleEmployee() {
    this.isEmployee = !this.isEmployee;
  }
  addUser() {
    if (this.userForm.valid) {
      const newUser: addUser = this.userForm.value;
      console.log('User added:', newUser);
      console.log('Form:', this.userForm.value);
  
      this.userServices.addUser(newUser).subscribe(
        result => {
          const signedInUser = JSON.parse(sessionStorage.getItem('User')!);
          const id = signedInUser.id;
          const transaction: AddAuditTrailViewModels = {
            AdditionalData: "Added user:" + this.userForm.value.emailAddress,
            DateOfTransaction: new Date(),
            TransactionType: "Post",
            SystemUserId: id
          };
          console.log(transaction);
  
          this.loginService.CreateTransaction(transaction).subscribe(
            result => {
              console.log("Successfully added transaction." + result);
  
              if (this.isEmployee && this.employeeform.valid) {
                const newEmployee: Employee = this.employeeform.value;
                newEmployee.EmailAddress = this.userForm.value.emailAddress;
                newEmployee.PhoneNumber = this.userForm.value.phoneNumber;
                console.log('Employee added:', newEmployee);
  
                this.employeeService.addEmployee(newEmployee).subscribe(
                  result => {
                    const transaction: AddAuditTrailViewModels = {
                      AdditionalData: "Added employee:" + this.userForm.value.emailAddress,
                      DateOfTransaction: new Date(),
                      TransactionType: "Post",
                      SystemUserId: id
                    };
                    console.log(transaction);
                    console.log('User and employee added successfully');
                    this.openSnackBar('User and employee added successfully');
  
                    this.loginService.CreateTransaction(transaction).subscribe(
                      result => {
                        console.log("Successfully added transaction." + result);
                        this.router.navigate(['/all-user']);
                      },
                      error => {
                        console.log("Unable to add transaction." + error.error);
                        this.openSnackBar('Unable to add employee transaction', error.error);
                      }
                    );
                  },
                  error => {
                    console.log('Failed to add employee:', error.error);
                    this.openSnackBar('Failed to add employee', error.error);
                  }
                );
              } else {
                this.router.navigate(['/all-user']);
                this.openSnackBar('User added successfully');
              }
            },
            error => {
              console.log("Unable to add user transaction." + error.error);
              this.openSnackBar('Unable to add user transaction', error.error);
            }
          );
        },
        error => {
          console.log('Failed to add user:', error.error[0]);
          this.openSnackBar('Failed to add user', error.error[0]);
        }
      );
    } else {
      console.log('User form is invalid');
      this.openSnackBar('User form is invalid');
  
      if (this.isEmployee && this.employeeform.invalid) {
        this.openSnackBar('Employee form is invalid');
      }
    }
  }
  
  
}
