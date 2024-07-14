import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';
import { EditEmployee } from '../shared/EditEmployee';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.scss']
})
export class EditEmployeeDialogComponent implements OnInit {
  editEmployeeForm: FormGroup;
  jobTitles: any[] = [];
  isLoading = false;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.editEmployeeForm = this.fb.group({
      jobTitleId: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadJobTitles();
  }

  loadJobTitles(): void {
    this.isLoading = true;
    this.employeeService.getJobtitles().subscribe(results => {
      this.jobTitles = results;
      this.setInitialFormValues();
      this.isLoading = false;
    },
    error => {
      console.error('Error fetching job titles:', error);
      this.isLoading = false;
    });
  }

  setInitialFormValues(): void {
    this.editEmployeeForm.patchValue({
      jobTitleId: this.data.jobTitleId || '',
      address: this.data.address || ''
    });
  }

  onSave(): void {
    if (this.editEmployeeForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    const updatedEmployee: EditEmployee = {
      EmployeeId: this.data.employeeId,
      JobTitleId: Number(this.editEmployeeForm.get('jobTitleId')?.value) || -1,
      Address: this.editEmployeeForm.get('address')?.value || ''
  };

    this.isLoading = true;
    this.employeeService.editEmployee(updatedEmployee).subscribe(response => {
      console.log('Employee details updated successfully:', response);
      this.dialogRef.close(response);
    }, (error: HttpErrorResponse) => {
      console.error('Error saving employee:', error);
      this.errorMessage = this.getErrorMessage(error);
    }).add(() => {
      this.isLoading = false;
    });
  }

  getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 400 && error.error.errors) {
      const validationErrors = error.error.errors as { [key: string]: string[] };
      return Object.values(validationErrors).map(err => err.join(' ')).join(' ');
    }
    return 'An unexpected error occurred.';
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

