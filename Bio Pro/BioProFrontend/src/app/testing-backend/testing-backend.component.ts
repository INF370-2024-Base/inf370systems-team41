import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SystemUser } from '../shared/systemuser';
import { AppComponent } from '../app.component';
import { UserServices } from '../services/user.service';
import { EditUser } from '../shared/EditUser';
import { error } from 'console';
import { ResetPassword, UpdateUser } from '../shared/UpdateUser';

@Component({
  selector: 'app-testing-backend',
  templateUrl: './testing-backend.component.html',
  styleUrls: ['./testing-backend.component.scss']
})
export class TestingBackendComponent implements OnInit {
  userToEdit:any
  editedUser:EditUser={
    Surname:"Schoeman",
    Name:"Pieter",
    Role:"employee",
    Phonenumber:"0845678945",
    OldEmail:"bioprosystem717EmployeeNineUpdatedTwo@gmail.com",
    UpdatedEmail:"bioprosystem717EmployeeNineUpdatedTwo@gmail.com"
  }
  passwordtoreset:ResetPassword={
    NewPassword:"Test135#",
    UserEmail:"bioprosystem717EmployeeNineUpdatedTwo@gmail.com"
  }
  passwordtoupdate:UpdateUser={
UserEmail:"bioprosystem717EmployeeEight@gmail.com",
OldPassword:"Test135#",
NewPassword:"Test137#"
  }
  email:string="bioprosystem717@gmail.com"
  constructor(private userService:UserServices) { }

  ngOnInit(): void {
    
    //edit user
    this.userService.UpdateUser(this.editedUser).subscribe(result=>{
        console.log(result)
      },error=>
      {
        console.log(error)
      })
      this.userService.GetUser(this.editedUser.OldEmail).subscribe(result=>{
        console.log(result)
        this.sendEmail()
      },error=>
      {
        console.log(error)
      })
       //send reset email
       
  }
        //send reset email
  sendEmail()
       {
        this.userService.SendResetPasswordEmail(this.email).subscribe(result=>{
          console.log(result)
          this.resetuserpassword()
        },error=>
        {
          console.log(error)
        })
       }
       
      //resetpassword
      
      resetuserpassword()
      {
        this.userService.ResetUserPassword(this.passwordtoreset).subscribe(result=>{
          console.log(result)
          this.updatepassword()
        },error=>
        {
          console.log(error)
        })
      }
      updatepassword()
      {
        this.userService.UpdatePassword(this.passwordtoupdate).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }

}
