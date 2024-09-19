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
  users: any[] = []; // Array to hold all users
  filteredUsers: any[] = []; // Array to hold filtered users based on search

  constructor(
    private userService: UserServices,
    private loginservice: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchAllUsers();
    this.setupScrollListener();
    this.searchControl.valueChanges.pipe(
      debounceTime(700) // 700 milliseconds debounce
    ).subscribe(value => {
      this.onOrderIdChange(value);
    });
  }

  get paginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
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
    console.log(this.paginatedUsers)
  }

  fetchAllUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe(
      data => {
        this.users = data;
        this.filteredUsers = data; // Initially show all users
        this.loading = false;
        console.log(this.filteredUsers)
      },
      error => {
        this.loading = false; // Handle error and stop loading
      }
    );
  }

  editEmployee(user: any) {
    const dialogRef = this.dialog.open(EditAnyUserComponent, {
      width: '400px',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchAllUsers();
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
          this.fetchAllUsers();
          this.loginservice.addTransaction("Put", "User removed access for:" + user.email)
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

  searchEmployees() {
    const searchCriteria = this.searchControl.value.trim().toLowerCase();
    if (!searchCriteria) {
      this.filteredUsers = this.users; // Show all users if search is empty
      return;
    }

    this.filteredUsers = this.users.filter(user => {
      const fullName = (user.name + ' ' + user.surname).toLowerCase();
      return (
        user.name.toLowerCase().includes(searchCriteria) ||
        user.surname.toLowerCase().includes(searchCriteria) ||
        fullName.includes(searchCriteria) ||
        user.email.toLowerCase().includes(searchCriteria) ||
        user.phoneNumber.toLowerCase().includes(searchCriteria) ||
        user.roles.toLowerCase().includes(searchCriteria)
      );
    });
  }

  onOrderIdChange(searchCriteria: string) {
    this.filteredUsers = this.users.filter(user => {
      const fullName = (user.name + ' ' + user.surname).toLowerCase();
      return (
        user.name.toLowerCase().includes(searchCriteria) ||
        user.surname.toLowerCase().includes(searchCriteria) ||
        fullName.includes(searchCriteria) ||
        user.email.toLowerCase().includes(searchCriteria) ||
        user.phoneNumber.toLowerCase().includes(searchCriteria) ||
        user.roles.toLowerCase().includes(searchCriteria)
      );
    });
  }

  // Scroll functions remain the same as before
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
