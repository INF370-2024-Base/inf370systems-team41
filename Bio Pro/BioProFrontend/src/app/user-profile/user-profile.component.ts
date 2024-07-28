import { Component, OnInit } from '@angular/core';
import { UserServices } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  errorMessage: string = '';

  constructor(private userServices: UserServices) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userServices.getAllUsers().subscribe(
      data => {
        this.users = data;
        this.filteredUsers = data;
      },
      error => {
        this.errorMessage = 'Error fetching user data';
        console.error(error);
      }
    );
  }

  searchUsers(): void {
    if (this.searchQuery.trim()) {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.surname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  deleteUser(user: any): void {
    this.userServices.RemoveAccess(user.email).subscribe(
      response => {
        this.loadUsers();  // Reload the user list after deletion
      },
      error => {
        this.errorMessage = 'Error deleting user';
        console.error(error);
      }
    );
  }

 
}
