import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Dentist } from '../shared/dentist';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PhoneChecker } from '../validators/Validators';


@Component({
  selector: 'app-add-dentist',
  templateUrl: './add-dentist.component.html',
  styleUrls: ['./add-dentist.component.scss']
})
export class AddDentistComponent implements OnInit {

  addDentistForm:FormGroup
  constructor(
    private dataService: DataService, 
    private router: Router, 
    private snackBar: MatSnackBar, // Corrected constructor with MatSnackBar
    private fb: FormBuilder
  ) 
  {this.addDentistForm = this.fb.group({
    LastName: ['', Validators.required],
    FirstName: ['', Validators.required],
    ContactDetail:['',Validators.required],
    Address:['',Validators.required]
  }); }

  ngOnInit(): void {
  }
dentist:Dentist={
  dentistId:0,
  lastName:"",
  firstName:"",
  contactDetail:"",
  address:""
}
  addDentist() {
    if (this.addDentistForm.valid) {
      console.log(this.addDentistForm.value);
      this.dentist.address=this.addDentistForm.value.Address
      this.dentist.contactDetail=this.addDentistForm.value.ContactDetail
      this.dentist.firstName=this.addDentistForm.value.FirstName
      this.dentist.lastName=this.addDentistForm.value.LastName  
      this.dataService.addDentist(this.dentist).subscribe({
        next: (dentist) => {
          this.router.navigate(['Dentist']);
          this.snackBar.open('Dentist added successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'] // Optional: custom CSS class for styling
          });
          console.log(dentist);
        },
        error: (error) => {
          this.snackBar.open('Error adding dentist: ' + error.message, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'] // Optional: custom CSS class for styling
          });
          console.error('Error adding dentist:', error);
        }
      });
    }
    else
    this.snackBar.open("Not all fields are valid")
  }

  cancel() {
    this.router.navigate(['dentists']);
  }
}
