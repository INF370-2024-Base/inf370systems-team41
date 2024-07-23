import { Component, Inject, OnInit } from '@angular/core';
import { UserServices } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EditUser } from '../shared/EditUser';

@Component({
  selector: 'app-edit-any-user',
  templateUrl: './edit-any-user.component.html',
  styleUrls: ['./edit-any-user.component.scss']
})
export class EditAnyUserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';

  editUserForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  jobTitles: any[] = [];
  jobTitleMap: Map<number, string> = new Map(); // Store job title mapping

  constructor(
    private fb: FormBuilder,
    private userServices: UserServices,
    private userService: UserServices,
    private router: Router, @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EditAnyUserComponent>
  ) {
    this.editUserForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      emailaddress: ['', [Validators.required, Validators.email]],
      phonenumber: ['', Validators.required],
      role:['', Validators.required]
    });
  }
  roles:any[]=[]
ngOnInit(): void {
this.getRoles();
this.loadUserDetails()

}
getRoles()
{  this.userService.getRoles().subscribe(result=>
  {
    this.roles=result
    console.log(this.roles)
  }
  )

}
onSubmit(): void {
  const user = JSON.parse(sessionStorage.getItem('User') || '{}');
  console.log('onSubmit called');
  console.log(this.editUserForm.value);
  if (this.editUserForm.valid) {
    const formValue = this.editUserForm.value;
console.log(formValue)
    const editedUser: EditUser = {
      Name:formValue.name,
      Surname:formValue.surname,
      Phonenumber:formValue.phonenumber,
      OldEmail:this.data.email,
      UpdatedEmail:formValue.emailaddress,
      Role:formValue.role
    };
    console.log('Edited user details being sent:', editedUser);
    this.userServices.UpdateUser(editedUser)
      .subscribe(
        response => {
          console.log('User details updated successfully:', response);
          this.successMessage = 'User details updated successfully!';
          this.dialogRef.close(true)
          this.router.navigate(['/all-user']);
        },
        error => {
          console.error('Error updating user details:', error);
          this.errorMessage = 'Failed to update user details.';
        }
      );
  }
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
  loadUserDetails(): void {
    console.log('loadUserDetails called');
    const user = JSON.parse(sessionStorage.getItem('User') || '{}');
    console.log('User details from sessionStorage:', this.data);

    if (user && user.email) {

          this.editUserForm.patchValue({
            name: this.data.name,
            surname: this.data.surname,
            emailaddress: this.data.email,
            phonenumber: this.data.phoneNumber,
            role: this.data.roles,
          });
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
