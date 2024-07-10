import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StockServices } from '../services/stock.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-used',
  templateUrl: './stock-used.component.html',
  styleUrls: ['./stock-used.component.scss']
})
export class StockUsedComponent implements OnInit {

  form: FormGroup;
  allStock: any[] = []; 
  stockUsed: StockUsedDuringOrder[] = [];

  constructor(private dialogRef: MatDialogRef<StockUsedComponent>,
    private dialog: MatDialog,
    private dataService: StockServices,
    @Inject(MAT_DIALOG_DATA) public data: { event: any },private snackBar:MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      stockItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.dataService.getAllStock().subscribe(result => {
        this.allStock = result;
        this.addStockItem();
        console.log(this.allStock);
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  get stockItems(): FormArray {
    return this.form.get('stockItems') as FormArray;
  }

  addStockItem(stock: StockUsedDuringOrder = { StockId: 0, Quantity: 0 }): void {
    const stockGroup = this.fb.group({
      StockId: [stock.StockId, [Validators.required,this.stockValidator.bind(this)]],
      Quantity: [stock.Quantity, [Validators.required, Validators.min(1)]]
    });
    this.stockItems.push(stockGroup);
    this.stockUsed.push(stock);
  }
  stockValidator(control: FormControl) {
    const isValid = this.allStock.some(stock => stock.stockId === control.value);
    return isValid ? null : { invalidStockId: true };
  }
  stockDataToSend:StockData={
    StockUsed:[],
    OrderId:''

  }
  id:number=0
  SubmitForm(): void {
    // Check if the form is valid using the separate method
    if (!this.checkStockAndQuantityValid()) {
      return;
    }

    // Proceed with form submission if all fields are valid
    this.stockUsed = this.stockItems.value.map((item: any) => ({
      StockId: item.StockId,
      Quantity: item.Quantity
    }));
    this.stockDataToSend.StockUsed = this.stockUsed;
    this.stockDataToSend.OrderId = this.data.event.orderId;
    this.dialogRef.close(this.stockDataToSend);
  }
  checkStockAndQuantityValid(): boolean {
    let isValid = true;
    let errors: string[] = [];
    this.stockItems.controls.forEach((control, index) => {
      const stockIdControl = control.get('StockId');
      const quantityControl = control.get('Quantity');

      if (stockIdControl?.hasError('required') || stockIdControl?.hasError('invalidStockId')) {
        errors.push(`Form ${index + 1}: Stock item must be chosen.`);
        isValid = false;
      }

      if (quantityControl?.hasError('required') || quantityControl?.hasError('min')) {
        errors.push(`Form ${index + 1}: Quantity must be at least 1.`);
        isValid = false;
      }
    });

    if (!isValid) {
      this.snackBar.open(`Please fix the following errors:\n${errors.join('\n')}`, 'Close', {
        duration: 5000,
      });
    }

    return isValid;
  }

  
}
export class StockData{
  StockUsed:StockUsedDuringOrder[]=[];
  OrderId:string=''
  
}

export class StockUsedDuringOrder {
  StockId: number = 0;
  Quantity: number = 0;
}
