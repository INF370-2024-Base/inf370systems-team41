import { Component, OnInit } from '@angular/core';

import { StockServices } from '../services/stock.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditStockCategoryComponent } from '../edit-stock-category/edit-stock-category.component';
@Component({
  selector: 'app-add-stock-category',
  templateUrl: './add-stock-category.component.html',
  styleUrls: ['./add-stock-category.component.scss']
})
export class AddStockCategoryComponent implements OnInit {

  editForm: FormGroup;
  allStockTypes: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditStockCategoryComponent>,
    private stockService: StockServices,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      StockTypeId: ['', Validators.required],
      Description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.GetAllStockType();
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
      const updatedCategory = this.editForm.value;
      // Call the service to save the updated category
      this.stockService.CreateStockCategory(updatedCategory).subscribe(
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
