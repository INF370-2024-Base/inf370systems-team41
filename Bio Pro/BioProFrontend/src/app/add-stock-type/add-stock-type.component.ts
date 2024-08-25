import { Component, Inject, OnInit } from '@angular/core';
import { StockServices } from '../services/stock.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-add-stock-type',
  templateUrl: './add-stock-type.component.html',
  styleUrls: ['./add-stock-type.component.scss']
})
export class AddStockTypeComponent implements OnInit {

  addForm: FormGroup;
  allStockTypes: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddStockTypeComponent>,
    private stockService: StockServices,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,private loginService:DataService
  ) {
    this.addForm = this.formBuilder.group({
      Description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSave() {
    if (this.addForm.valid) {
      const updatedType = this.addForm.value;
      // Call the service to save the updated category
      this.stockService.CreateStockType(updatedType).subscribe(
        (response) => {
          this.loginService.addTransaction("Post","Created stock type: "+updatedType.Description)
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
