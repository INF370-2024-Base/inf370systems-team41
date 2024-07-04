import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from '../services/user.service';
import { EmployeeService } from '../services/employee.service';
import { EditUser } from '../shared/EditUser';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  jobTitles: any[] = [];
  jobTitleMap: Map<number, string> = new Map(); // Store job title mapping

  constructor(
    private fb: FormBuilder,
    private userServices: UserServices,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.editUserForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      emailaddress: ['', [Validators.required, Validators.email]],
      phonenumber: ['', Validators.required],
      rolename: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.getJobTitles();
  }

  getJobTitles(): void {
    this.employeeService.getJobtitles().subscribe(
      (results: any[]) => {
        this.jobTitles = results;
        this.jobTitles.forEach(jobTitle => {
          this.jobTitleMap.set(jobTitle.JobTitleId, jobTitle.Name);
        });
        this.loadUserDetails(); // Load user details after fetching job titles
      },
      error => {
        console.log('Error fetching job titles:', error);
      }
    );
  }

  loadUserDetails(): void {
    console.log('loadUserDetails called');
    const user = JSON.parse(sessionStorage.getItem('User') || '{}');
    console.log('User details from sessionStorage:', user);

    if (user && user.email) {
      this.employeeService.getEmployeeByEmail(user.email).subscribe(
        (employee: any) => {
          console.log('Employee details fetched:', employee);
          const jobTitleName = this.jobTitleMap.get(employee.JobTitleId);
          this.editUserForm.patchValue({
            name: employee.firstName,
            surname: employee.lastName,
            emailaddress: employee.email,
            phonenumber: employee.cellphoneNumber,
            rolename: jobTitleName || '' // Display job title name
          });
        },
        error => {
          console.error('Error fetching employee details:', error);
          this.errorMessage = 'Failed to load user details.';
        }
      );
    }
  }

  onSubmit(): void {
    console.log('onSubmit called');
    if (this.editUserForm.valid) {
      const formValue = this.editUserForm.value;
      const editedUser: EditUser = {
        ...formValue,
        JobTitleId: this.getJobTitleId(formValue.rolename) // Convert job title name back to ID
      };
      console.log('Edited user details being sent:', editedUser);
      this.userServices.UpdateUser(editedUser)
        .subscribe(
          response => {
            console.log('User details updated successfully:', response);
            this.successMessage = 'User details updated successfully!';
            sessionStorage.setItem('User', JSON.stringify(editedUser));
            this.router.navigate(['/home']);
          },
          error => {
            console.error('Error updating user details:', error);
            this.errorMessage = 'Failed to update user details.';
          }
        );
    }
  }

  getJobTitleId(jobTitleName: string): number | null {
    for (let [key, value] of this.jobTitleMap) {
      if (value === jobTitleName) {
        return key;
      }
    }
    return null; // or handle appropriately
  }
}