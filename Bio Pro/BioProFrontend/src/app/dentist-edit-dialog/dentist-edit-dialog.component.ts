import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dentist } from '../shared/dentist';

@Component({
  selector: 'app-dentist-edit-dialog',
  templateUrl: './dentist-edit-dialog.component.html',
  styleUrls: ['./dentist-edit-dialog.component.scss']
})
export class DentistEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DentistEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dentist: Dentist }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}

