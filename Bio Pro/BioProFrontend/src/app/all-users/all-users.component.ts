import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { UserServices } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditAnyUserComponent } from '../edit-any-user/edit-any-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  deleteEmployee(user:any) {
    console.log (user)
    if (!user.email) {
      console.error('EmployeeId is undefined. Cannot delete employee.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${user.name} ${user.surname}?`)) {
      this.userService.RemoveAccess(user.email).subscribe(() => {
        this.fetchAllusers(); // Refresh the list after deleting
      }, error => {
        console.error('Error deleting employee:', error);
      });
    }
  }
searchQuery:string=''
  searchEmployees() {
    // this.userService.searchEmployees(this.users).subscribe(data => {
    //   this.users = data;
    // });
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
