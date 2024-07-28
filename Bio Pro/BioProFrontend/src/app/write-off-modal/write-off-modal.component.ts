import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockWriteOffViewModel } from '../shared/Stock';

@Component({
  selector: 'app-write-off-modal',
  templateUrl: './write-off-modal.component.html',
  styleUrls: ['./write-off-modal.component.scss']
})
export class WriteOffModalComponent {
  writeOffForm: FormGroup;
  currentDate: string;

  constructor(
    public dialogRef: MatDialogRef<WriteOffModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.currentDate = new Date().toISOString().substring(0, 10);
    this.writeOffForm = this.fb.group({
      quantityWrittenOff: ['', Validators.required],
      writtenOffDate: [this.currentDate, Validators.required],
      reason: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.writeOffForm.value)
    if (this.writeOffForm.valid) {
      const writeOffData: StockWriteOffViewModel = {
        stockId: this.data.stockId,
        quantityWrittenOff: this.writeOffForm.value.quantityWrittenOff,
        writtenOffDate: this.writeOffForm.value.writtenOffDate,
        reason: this.writeOffForm.value.reason,
        stockName:this.writeOffForm.value.name
      };
      console.log('stockId'+writeOffData.stockId)
      this.dialogRef.close(writeOffData);
    }
  }
}
