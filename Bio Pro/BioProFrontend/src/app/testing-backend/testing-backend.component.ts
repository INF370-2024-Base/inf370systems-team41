import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SystemUser } from '../shared/systemuser';
import { AppComponent } from '../app.component';
import { UserServices } from '../services/user.service';
import { EditUser } from '../shared/EditUser';
import { error } from 'console';
import { ResetPassword, UpdateUser } from '../shared/UpdateUser';
import { EmployeeService } from '../services/employee.service';
import { EditEmployee } from '../shared/EditEmployee';
import { DentistService } from '../shared/dentist.service';
import { Dentist } from '../shared/dentist';

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
    OldEmail:"bioprosystem717EmployeeNine@gmail.com",
    UpdatedEmail:"bioprosystem717EmployeeNineUpdated@gmail.com"
  }
  passwordtoreset:ResetPassword={
    NewPassword:"Test135#",
    UserEmail:this.editedUser.UpdatedEmail
  }
  passwordtoupdate:UpdateUser={
UserEmail:"bioprosystem717EmployeeEight@gmail.com",
OldPassword:"Test135#",
NewPassword:"Test137#"
  }
  email:string="bioprosystem717@gmail.com"
  editemployee:EditEmployee={
    EmployeeId:5,
    Address:"Test",
    JobTitleId:2

  }
editDentistTest:Dentist={
  dentistId:2,
lastName:"schoeman",
firstName:"Pieter",
contactDetail:"0811456789",
address:"tersert"
}
  constructor(private userService:UserServices,private employeeService:EmployeeService,private dentistService:DentistService) { }

  ngOnInit(): void {
       
  }
  editUser(){
    //edit user
    this.userService.UpdateUser(this.editedUser).subscribe(result=>{
      console.log(result)
    },error=>
    {
      console.log(error)
    })

  }
  getUser(){
    this.userService.GetUser(this.editedUser.UpdatedEmail).subscribe(result=>{
      console.log(result)
    },error=>
    {
      console.log(error)
    })
  }
        //send reset email
  sendEmail()
       {
        this.userService.SendResetPasswordEmail(this.email).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
       }
       
      //resetpassword
      
      resetUserPassword()
      {
        this.userService.ResetUserPassword(this.passwordtoreset).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
      updatePassword()
      {
        this.userService.UpdatePassword(this.passwordtoupdate).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
      
      removeAccess()
      {
        this.userService.RemoveAccess(this.passwordtoupdate.UserEmail).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }

      editEmployee()
      {
        this.employeeService.editEmployee(this.editemployee).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
      deleteEmployee()
      {
        this.employeeService.deleteEmployee(7).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }

      editDentist()
      {
        this.dentistService.editDentist(this.editDentistTest.dentistId,this.editDentistTest).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
      deleteDentist()
      {
        this.dentistService.deleteDentist(this.editDentistTest.dentistId).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }

}
