import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dentist } from '../shared/dentist';
import { PhoneChecker } from '../validators/Validators';

@Component({
  selector: 'app-dentist-edit-dialog',
  templateUrl: './dentist-edit-dialog.component.html',
  styleUrls: ['./dentist-edit-dialog.component.scss']
})
export class DentistEditDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DentistEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dentist: Dentist }
  ) {
    this.editForm = this.fb.group({
      firstName: [data.dentist.firstName, Validators.required],
      lastName: [data.dentist.lastName, Validators.required],
      contactDetail: [data.dentist.contactDetail, [Validators.required, PhoneChecker.SouthAfricanPhoneNumberValidator()]],
      address: [data.dentist.address],
      dentistId: [data.dentist.dentistId]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid) {
      console.log('Edited Dentist Data:', this.editForm.value);
      this.dialogRef.close(this.editForm.value);
    }
  }
}
