import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dentist } from '../shared/dentist';

@Component({
  selector: 'app-confirm-delete-dentist',
  templateUrl: './confirm-delete-dentist.component.html',
  styleUrls: ['./confirm-delete-dentist.component.scss']
})
export class ConfirmDeleteDentistComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDentistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dentist: Dentist }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
