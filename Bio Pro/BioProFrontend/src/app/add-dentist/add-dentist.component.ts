// add-dentist.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Dentist } from '../shared/dentist';

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

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  addDentist() {
    this.dataService.addDentist(this.addDentistAtt).subscribe({
      next: (dentist) => {
        this.router.navigate(['dentists']);
        console.log(dentist);
      }
    });
  }

  cancel() {
    this.router.navigate(['dentists']);
  }
}