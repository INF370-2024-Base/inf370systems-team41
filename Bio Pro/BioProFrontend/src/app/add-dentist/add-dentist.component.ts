import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; // Import NgForm
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Dentist } from '../shared/dentist';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-dentist',
  templateUrl: './add-dentist.component.html',
  styleUrls: ['./add-dentist.component.scss']
})
export class AddDentistComponent implements OnInit {
  addDentistAtt: Dentist = {
    dentistId: 0,
    lastName: '',
    firstName: '',
    contactDetail: '',
    address: ''
  };

  constructor(
    private dataService: DataService, 
    private router: Router, 
    private snackBar: MatSnackBar // Corrected constructor with MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  addDentist(form: NgForm) {
    if (form.valid) {
      this.dataService.addDentist(this.addDentistAtt).subscribe({
        next: (dentist) => {
          this.router.navigate(['dentists']);
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
  }

  cancel() {
    this.router.navigate(['dentists']);
  }
}
