import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { UserServices } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditAnyUserComponent } from '../edit-any-user/edit-any-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteUserComponent } from '../confirm-delete-user/confirm-delete-user.component';
import { DataService } from '../services/login.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {
  
  currentPage: number = 1;
  itemsPerPage: number = 9;
  searchControl = new FormControl();
  loading: boolean = true; // Loading state

  

  constructor(private userService:UserServices,private loginservice:DataService,private dialog:MatDialog,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.fetchAllusers() ;
    this.setupScrollListener();
    this.searchControl.valueChanges.pipe(
      debounceTime(700) // 1000 milliseconds = 1 second
    ).subscribe(value => {
      this.onOrderIdChange(value);
    });
  }
  users:any[]=[]

  get paginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.users.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
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

  fetchAllusers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      this.loading = false;
    }, error => {
      this.loading = false; // Handle error and stop loading
    });
  }

  editEmployee(user: any) {
    const dialogRef = this.dialog.open(EditAnyUserComponent, {
      width: '400px',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchAllusers();
        this.snackBar.open('User updated successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  deleteEmployee(user: any) {
    const dialogRef = this.dialog.open(ConfirmDeleteUserComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.RemoveAccess(user.email).subscribe(() => {
          this.fetchAllusers();
          this.loginservice.addTransaction("Put","User removed access for:"+user.email)
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
          });
        }, error => {
          this.snackBar.open('Error deleting user', 'Close', {
            duration: 3000,
          });
        });
      }
    });
  }

  searchQuery:string=''
  searchEmployees() {
    // Add your search logic here
  }

  onOrderIdChange(searchCriteria: string) {
    if (searchCriteria.trim() === '') {
      this.fetchAllusers();
    } else {
      this.users = this.users.filter((d) => {
        let fullName = (d.name + ' ' + d.surname).toLowerCase();
        return d.email.toLowerCase().includes(searchCriteria) ||
               d.name.toLowerCase().includes(searchCriteria) ||
               d.surname.toLowerCase().includes(searchCriteria) ||
               fullName.includes(searchCriteria);
      });
    }
  }

 
  scrollToBottom() {
    const scrollableElement = document.querySelector('.scroll-container');
    if (scrollableElement) {
      scrollableElement.scrollTo({
        top: scrollableElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
  
  scrollToTop() {
    const scrollableElement = document.querySelector('.scroll-container');
    if (scrollableElement) {
      scrollableElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      const scrollTopButton = document.getElementById('scroll-to-top');
      const scrollBottomButton = document.getElementById('scroll-to-bottom');
      
      if (window.scrollY > 300) {
        scrollTopButton!.style.display = 'block';
      } else {
        scrollTopButton!.style.display = 'none';
      }

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
        scrollBottomButton!.style.display = 'none';
      } else {
        scrollBottomButton!.style.display = 'block';
      }
    });
  }
}
