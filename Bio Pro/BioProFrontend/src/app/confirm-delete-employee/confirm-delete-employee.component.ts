import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-employee',
  templateUrl: './confirm-delete-employee.component.html',
  styleUrls: ['./confirm-delete-employee.component.scss']
})
export class ConfirmDeleteEmployeeComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
