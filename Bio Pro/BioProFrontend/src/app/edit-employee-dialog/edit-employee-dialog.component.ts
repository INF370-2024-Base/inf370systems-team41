import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../shared/employee';
import { EditEmployee } from '../shared/EditEmployee';

@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.scss']
})
export class EditEmployeeDialogComponent implements OnInit {
  editEmployeeForm: FormGroup;
  jobTitles: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.editEmployeeForm = this.fb.group({
      jobTitleId: [data.JobTitleId, Validators.required],
      address: [data.Address || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getJobTitles();
  }

  getJobTitles() {
    this.employeeService.getJobtitles().subscribe(results => {
      this.jobTitles = results;
    },
    error => {
      console.log(error);
    });
  }

  onSave(): void {
    if (this.data.employeeId === undefined) {
      console.error('EmployeeId is undefined');
      return;
    }

    const updatedEmployee: EditEmployee = {
      EmployeeId: this.data.employeeId,
      JobTitleId: this.editEmployeeForm.get('jobTitleId')?.value || -1,
      Address: this.editEmployeeForm.get('address')?.value || ''
    };

    this.employeeService.editEmployee(updatedEmployee).subscribe(response => {
      this.dialogRef.close(response);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
