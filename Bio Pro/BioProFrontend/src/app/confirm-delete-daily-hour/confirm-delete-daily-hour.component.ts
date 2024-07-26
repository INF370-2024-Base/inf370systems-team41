import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-daily-hour',
  templateUrl: './confirm-delete-daily-hour.component.html',
  styleUrls: ['./confirm-delete-daily-hour.component.scss']
})
export class ConfirmDeleteDailyHourComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDailyHourComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dailyHourId: number }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
