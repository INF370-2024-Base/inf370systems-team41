import { Component, OnInit } from '@angular/core';
import { DentistService } from '../services/dentist.service';
import { Dentist } from '../shared/dentist';

@Component({
  selector: 'app-dentist-profile',
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent implements OnInit {
  dentists: Dentist[] = [];
  filteredDentists: Dentist[] = []; // Array to hold filtered dentists
  searchQuery = '';
  displayedColumns: string[] = ['name', 'contactDetail', 'address']; // Define displayedColumns property

  constructor(private dentistService: DentistService) { }

  ngOnInit(): void {
    this.fetchDentists();
  }

  fetchDentists(): void {
    this.dentistService.getAllDentists().subscribe(dentists => {
      this.dentists = dentists;
      // Initially, set filteredDentists to all dentists
      this.filteredDentists = [...this.dentists];
    });
  }

  search(): void {
    if (this.searchQuery.trim() === '') {
      // If the search query is empty, reset filteredDentists to all dentists
      this.filteredDentists = [...this.dentists];
    } else {
      // Otherwise, filter dentists based on searchQuery
      this.filteredDentists = this.dentists.filter(dentist =>
        dentist.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        dentist.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        dentist.contactDetail.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      );
    }
  }
}

