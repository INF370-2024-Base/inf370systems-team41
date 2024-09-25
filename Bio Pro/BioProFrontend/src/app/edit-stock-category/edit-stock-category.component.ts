import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StockServices } from '../services/stock.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-edit-stock-category',
  templateUrl: './edit-stock-category.component.html',
  styleUrls: ['./edit-stock-category.component.scss']
})
export class EditStockCategoryComponent implements OnInit {
  editForm: FormGroup;
  allStockTypes: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditStockCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: any },
    private stockService: StockServices,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,private loginService:DataService
  ) {
    this.editForm = this.formBuilder.group({
      StockTypeId: [this.data.category.stockType.stockTypeId, Validators.required],
      Description: [this.data.category.description, Validators.required],
      StockCategoryId: [this.data.category.stockCategoryId, Validators.required]
    });
  }

  ngOnInit(): void {
    this.GetAllStockType();
    console.log(this.data.category.stockType.stockTypeId);
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
      this.stockService.EditStockCategory(updatedCategory).subscribe(
        (response) => {
          this.loginService.addTransaction("Put","Edited stock category: "+updatedCategory.Description)
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
