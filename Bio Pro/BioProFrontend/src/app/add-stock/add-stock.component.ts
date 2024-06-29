import { Component, OnInit } from '@angular/core';
import { StockServices } from '../services/stock.service';
import { CaptureNewStockViewModel } from '../shared/Stock';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddStock } from '../shared/Stock'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent implements OnInit {
  captureStockForm: FormGroup;
  StockCategories: any[] = [];
  StockSuppliers: any[] = [];

  constructor(private stockService: StockServices, private fb: FormBuilder) {
    this.captureStockForm = this.fb.group({
      stockCategoryId: ['', Validators.required],
      supplierId: ['', Validators.required],
      stockName: ['', Validators.required],
      quantityAvailable: ['', Validators.required],
      maximumStockLevel: ['', Validators.required],
      minimumStockLevel: ['', Validators.required],
      reorderPoint: [''],
      measurement: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllStockCategoriesandType();
  }

  captureStock(): void {
    if (this.captureStockForm.valid) {
      const captureStockData: AddStock = this.captureStockForm.value;
      this.stockService.addStock(captureStockData).subscribe(
        response => {
          console.log('Stock captured successfully', response);
        },
        error => {
          console.error('Error capturing stock', error);
        }
      );
    }
  }

  getAllStockCategoriesandType(): void {
    this.stockService.getAllStockCategories().subscribe(
      result => {
        this.StockCategories = result;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
    this.stockService.getAllSupplier().subscribe(
      result => {
        this.StockSuppliers = result;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );  
  }
}
