import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DentistService } from '../shared/dentist.service';
import { Dentist } from '../shared/dentist';
import { DentistEditDialogComponent } from '../dentist-edit-dialog/dentist-edit-dialog.component';
import { ConfirmDeleteDentistComponent } from '../confirm-delete-dentist/confirm-delete-dentist.component';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-dentist-profile',
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent implements OnInit {
  dentists: Dentist[] = [];
  filteredDentists: Dentist[] = [];
  searchQuery = '';
  noResultsFound = false;
  currentPage: number = 1;
  itemsPerPage: number = 9;

  constructor(
    private dentistService: DentistService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,private loginService: DataService,
  ) { }

  ngOnInit(): void {
    this.fetchDentists();
  }

  fetchDentists(): void {
    this.dentistService.getAllDentists().subscribe(dentists => {
      this.dentists = dentists;
      this.filteredDentists = [...this.dentists];
      console.log(this.dentists)
    });
  }
  get paginatedDentists(): Dentist[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDentists.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredDentists.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Update paginated dentists after filtering or changing page
  private updatePaginatedDentists(): void {
    this.filteredDentists = this.paginatedDentists;
  }

  search(): void {
    if (this.searchQuery.trim() === '') {
        this.filteredDentists = [...this.dentists];
        this.noResultsFound = false;
    } else {
        this.filteredDentists = this.dentists.filter(dentist =>
            dentist.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            dentist.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            dentist.contactDetail.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            dentist.address.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.noResultsFound = this.filteredDentists.length === 0;
    }
    this.updatePaginatedDentists();
}

  openEditDialog(dentist: Dentist): void {
    const dialogRef = this.dialog.open(DentistEditDialogComponent, {
      width: '400px',
      data: { dentist }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const editDentist:Dentist=
        {
          address:result.address,
          dentistId:result.dentistId,
          contactDetail:result.contactDetail,
          firstName:result.firstName,
          lastName:result.lastName
        }
        console.log(result)
        this.dentistService.editDentist(editDentist.dentistId, editDentist).subscribe(
          editedDentist => {
            this.snackBar.open('Dentist edited successfully', 'Close', { duration: 3000 });
            this.loginService.addTransaction("Put","User edited dentist:"+editDentist.firstName+' '+editDentist.lastName)
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
    const dialogRef = this.dialog.open(ConfirmDeleteDentistComponent, {
      width: '400px',
      data: { dentist }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dentistService.deleteDentist(dentist.dentistId).subscribe(
          () => {
            this.snackBar.open('Dentist deleted successfully', 'Close', { duration: 3000 });
            this.loginService.addTransaction("Delete","User deleted dentist:"+dentist.firstName+' '+dentist.lastName)
            this.fetchDentists();
          },
          error => {
            this.snackBar.open('Error deleting dentist. Denist is connected to a past/present order.', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }
  onSearchChange(searchCriteria: string): void {
    if (searchCriteria.trim() === '') {
      this.filteredDentists = [...this.dentists];
      this.noResultsFound = false;
    } else {
      this.filteredDentists = this.dentists.filter(d => {
        let fullName = (d.firstName + ' ' + d.lastName).toLowerCase();
        return d.firstName.toLowerCase().includes(searchCriteria.toLowerCase()) ||
          d.address?.toLowerCase().includes(searchCriteria.toLowerCase()) ||
          d.lastName.toLowerCase().includes(searchCriteria.toLowerCase()) ||
          fullName.includes(searchCriteria.toLowerCase());
      });
      this.noResultsFound = this.filteredDentists.length === 0;
    }
  }
}
