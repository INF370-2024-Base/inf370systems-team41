import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StockServices } from '../services/stock.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

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
    @Inject(MAT_DIALOG_DATA) public data: { event: any },
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
      StockId: [stock.StockId, Validators.required],
      Quantity: [stock.Quantity, Validators.required]
    });
    this.stockItems.push(stockGroup);
    this.stockUsed.push(stock);
  }
  stockDataToSend:StockData={
    StockUsed:[],
    OrderId:''
  }
  SubmitForm()
  {
    this.stockUsed = this.stockItems.value.map((item: any) => ({
      StockId: item.StockId,
      Quantity: item.Quantity
    }));
    this.stockDataToSend.StockUsed=this.stockUsed
    this.stockDataToSend.OrderId=this.data.event.orderId
    this.dialogRef.close(this.stockDataToSend);
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
