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

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,private userServices:UserServices,private fb: FormBuilder,private employeeService:EmployeeService) {this.userForm = this.fb.group({
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

openSnackBar(message: string) {
  this.snackBar.open(message, 'Close', {
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
  async addUser() {
    if (this.userForm.valid) {
      try {
        const newUser: addUser = this.userForm.value;
        console.log('User added:', newUser);
        console.log('Form:', this.userForm.value);
  
        // Convert addUser() Observable to a promise and wait for its completion
        const userResult = await this.userServices.addUser(newUser).toPromise(); 
        this.openSnackBar('User added successfully');
  
        if (this.isEmployee && this.employeeform.valid) {
          const newEmployee: Employee = this.employeeform.value;
          newEmployee.EmailAddress = this.userForm.value.emailAddress;
          newEmployee.PhoneNumber = this.userForm.value.phoneNumber;
          console.log('Employee added:', newEmployee);
  
          // Convert addEmployee() Observable to a promise and wait for its completion
          const employeeResult = await this.employeeService.addEmployee(newEmployee).toPromise(); 
        }
  
        console.log('User and employee added successfully');
        this.openSnackBar('Employee added successfully');
      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP error response
          console.error('HTTP Error:', error);
          this.openSnackBar('HTTP Error:'+error.error[1].description); // Display error message from server
        } else {
          // Handle other types of errors
          console.error('Error adding user or employee:', error);
          this.openSnackBar('Error adding user or employee');
        }
      }
    } else {
      console.log('User form is invalid');
      this.openSnackBar('User form is invalid');
      if (this.isEmployee && this.employeeform.invalid) {
        this.openSnackBar('Employee form is invalid');
      }
    }
  }
}
