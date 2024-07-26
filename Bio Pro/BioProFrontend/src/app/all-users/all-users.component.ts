import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { UserServices } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditAnyUserComponent } from '../edit-any-user/edit-any-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteUserComponent } from '../confirm-delete-user/confirm-delete-user.component';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  constructor(private userService:UserServices,private dialog:MatDialog,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.fetchAllusers() 
  }
  users:any[]=[]
  fetchAllusers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      console.log(this.users)
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
}
