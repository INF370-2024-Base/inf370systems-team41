import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface CaptureNewStockModalData {
  stockId: number;
  stockName: string;
}

@Component({
  selector: 'app-capture-new-stock-modal',
  templateUrl: './capture-new-stock-modal.component.html',
  styleUrls: ['./capture-new-stock-modal.component.scss']
})
export class CaptureNewStockModalComponent {
  captureStockForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CaptureNewStockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CaptureNewStockModalData,
    private fb: FormBuilder
  ) {
    this.captureStockForm = this.fb.group({
      amountAdded: [null, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.captureStockForm.valid) {
      this.dialogRef.close({ ...this.captureStockForm.value, stockId: this.data.stockId });
    }
  }
}
