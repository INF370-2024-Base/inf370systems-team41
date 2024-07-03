import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/login.service';
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
import { StockServices } from '../services/stock.service';
import { AddStock, CaptureNewStockViewModel, StockWriteOffViewModel } from '../shared/Stock';

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
  constructor(private userService:UserServices,private employeeService:EmployeeService,private dentistService:DentistService,private stockService:StockServices) { }

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
  deleteemployeeDailyHoursId=3
      deleteEmployeeDailyHours()
      {
        this.employeeService.deleteEmployeeDailyHours(this.deleteemployeeDailyHoursId).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
      
      getEmployeeDailyHours()
      {
        this.employeeService.getEmployeeDailyHours().subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
      getAllStock()
      {
        this.stockService.getAllStock().subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
      getAllStockCategories()
      {
        this.stockService.getAllStockCategories().subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
      getAllStockTypes()
      {
        this.stockService.getAllStockTypes().subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
stockAddTest:AddStock=
{
  stockCategoryId: 1,
  supplierId: 10,
  stockName: "Test Stock",
  quantityAvailable: 200,
  maximumStockLevel: 1000,
  minimumStockLevel: 100,
  reorderPoint: "50",
  measurement:"ml"
}
      addStock()
      {
        this.stockService.addStock(this.stockAddTest).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
 stockWriteOffTest: StockWriteOffViewModel = {
        stockId: 1,
        quantityWrittenOff: 10,
        writtenOffDate: new Date(),
        reason: 'Damaged stock',
        stockName: 'Item A'
    };

captureNewStockTest: CaptureNewStockViewModel = {
  stockId: 2,
  amountAdded: 50.5
};
      addStockWriteOff()
      {
        this.stockService.addStockWriteOff(this.stockWriteOffTest).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }

      captureNewStock()
      {
        this.stockService.captureNewStock(this.captureNewStockTest).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }

      getallusers()
      {
        this.userService.getAllUsers().subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }

      getEmployeeByEmail()
      {
        this.employeeService.getEmployeeByEmail(this.email).subscribe(result=>{
          console.log(result)
        },error=>
        {
          console.log(error)
        })
      }
}
