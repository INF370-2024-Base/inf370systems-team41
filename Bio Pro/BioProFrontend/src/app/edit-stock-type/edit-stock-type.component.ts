import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StockServices } from '../services/stock.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-stock-type',
  templateUrl: './edit-stock-type.component.html',
  styleUrls: ['./edit-stock-type.component.scss']
})
export class EditStockTypeComponent implements OnInit {

  editForm: FormGroup;
  allStockTypes: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditStockTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: any },
    private stockService: StockServices,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      StockTypeId: [this.data.type.stockTypeId, Validators.required],
      Description: [this.data.type.description, Validators.required],
    });
  }

  ngOnInit(): void {
    this.GetAllStockType();
    console.log(this.data);
  }

  GetAllStockType() {
    this.stockService.getAllStockTypes().subscribe(
      (data: any[]) => {
        this.allStockTypes = data;
        console.log(this.allStockTypes);
      },
      (error) => {
        console.error('Error loading stock types:', error);
      }
    );
  }

  onSave() {
    if (this.editForm.valid) {
      const updatedType = this.editForm.value;
      // Call the service to save the updated category
      this.stockService.EditStockType(updatedType).subscribe(
        (response) => {
          this.snackBar.open('Stock category updated successfully', 'Close', {
            duration: 2000,
          });
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error updating stock category:', error);
          this.snackBar.open('Error updating stock category', 'Close', {
            duration: 2000,
          });
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
