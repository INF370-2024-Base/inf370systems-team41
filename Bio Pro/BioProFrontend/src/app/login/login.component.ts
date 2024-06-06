import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SystemUser } from '../shared/systemuser';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServices } from '../services/user.service';
import { EditUser } from '../shared/EditUser';
import { error } from 'console';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMessage: string = ''; 

  constructor(private router: Router, private dataService: DataService,private appComponent:AppComponent) { }

  user:SystemUser={
    EmailAddress:"",
    Password:"",
  }

  onSubmit() {
    sessionStorage.removeItem('Token')
    sessionStorage.removeItem('User')
    this.appComponent.getSignInUser();
    this.dataService.Login(this.user)
      .subscribe(
        (result: any) => {          
          sessionStorage.setItem('Token', JSON.stringify(result));
          this.checkSignInStatusAndNavigate(); 
        },
        (error) => {
          console.log(error)
          alert(error)
        }
      );
  }

  private checkSignInStatusAndNavigate() {
    this.dataService.checkSignInStatus()
      .subscribe(() => {
        if( sessionStorage.getItem('User')!=undefined)
        {this.router.navigate(['/home']);
        this.appComponent.getSignInUser();} 
      });
  }



  ngOnInit(): void {
    sessionStorage.removeItem('Token')
    sessionStorage.removeItem('User')
    this.appComponent.getSignInUser()
  }
  

}
