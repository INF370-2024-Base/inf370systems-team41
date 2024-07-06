import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DentistService } from '../shared/dentist.service';
import { Dentist } from '../shared/dentist';
import { DentistEditDialogComponent } from '../dentist-edit-dialog/dentist-edit-dialog.component';

@Component({
  selector: 'app-dentist-profile',
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent implements OnInit {
  dentists: Dentist[] = [];
  filteredDentists: Dentist[] = [];
  searchQuery = '';

  constructor(
    private dentistService: DentistService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchDentists();
  }

  fetchDentists(): void {
    this.dentistService.getAllDentists().subscribe(dentists => {
      this.dentists = dentists;
      this.filteredDentists = [...this.dentists];
    });
  }

  search(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredDentists = [...this.dentists];
    } else {
      this.filteredDentists = this.dentists.filter(dentist =>
        dentist.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        dentist.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        dentist.contactDetail.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  openEditDialog(dentist: Dentist): void {
    const dialogRef = this.dialog.open(DentistEditDialogComponent, {
      width: '250px',
      data: { dentist }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dentistService.editDentist(result.dentistId, result).subscribe(
          editedDentist => {
            this.snackBar.open('Dentist edited successfully', 'Close', { duration: 3000 });
            this.fetchDentists();
          },
          error => {
            this.snackBar.open('Error editing dentist', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  deleteDentist(dentist: Dentist): void {
    this.dentistService.deleteDentist(dentist.dentistId).subscribe(
      () => {
        this.snackBar.open('Dentist deleted successfully', 'Close', { duration: 3000 });
        this.fetchDentists();
      },
      error => {
        this.snackBar.open('Error deleting dentist', 'Close', { duration: 3000 });
      }
    );
  }

  onSearchChange(searchCriteria: string): void {
    if (searchCriteria.trim() === '') {
      this.fetchDentists();
    } else {
      this.filteredDentists = this.dentists.filter(d => {
        let fullName = (d.firstName + ' ' + d.lastName).toLowerCase();
        return d.firstName.toLowerCase().includes(searchCriteria) ||
          d.address?.toLowerCase().includes(searchCriteria) ||
          d.lastName.toLowerCase().includes(searchCriteria) ||
          fullName.includes(searchCriteria);
      });
    }
  }
}
