import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/login.service';
import { SystemUser } from '../shared/systemuser';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServices } from '../services/user.service';
import { EditUser } from '../shared/EditUser';
import { error } from 'console';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  user: SystemUser = {
    EmailAddress: "",
    Password: "",
    Name: "",
    Surname: "",
    Id: ""
  };
  
    // Options for dropdowns
    languages = ['English', 'Spanish', 'French', 'German', 'Korean', 'Chinese'];
    themes = ['light', 'dark'];
    timezones = ['UTC', 'GMT', 'PST', 'EST'];
  
    constructor(
      private snackBar: MatSnackBar,
      private router: Router,
      private dataService: DataService,
      private appComponent: AppComponent,
      private userService: UserServices,
      private dialog: MatDialog
    ) {}
  
    ngOnInit(): void {
      // Any initialization logic here, like fetching user data
      //this.loadUserSettings();
    }
  
    // loadUserSettings(): void {
    //   //this.userService.getUserSettings().subscribe((settings) => {
    //     this.user = settings;
    //   });
    // }
  
    // saveSettings(): void {
    //   this.userService.updateUserSettings(this.user).subscribe(
    //     (response) => {
    //       this.snackBar.open('Settings saved successfully!', 'Close', {
    //         duration: 3000
    //       });
    //     },
    //     (error: HttpErrorResponse) => {
    //       this.snackBar.open('Failed to save settings. Please try again.', 'Close', {
    //         duration: 3000
    //       });
    //     }
    //   );
    // }
  }
