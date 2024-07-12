import { Component, OnInit } from '@angular/core';
import { StockServices } from '../services/stock.service';
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
      reorderPoint: ['', Validators.required],
      measurement: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchStockCategoriesAndSuppliers();
  }

  fetchStockCategoriesAndSuppliers(): void {
    this.stockService.getAllStockCategories().subscribe(
      categories => {
        this.StockCategories = categories;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching stock categories:', error);
      }
    );

    this.stockService.getAllSupplier().subscribe(
      suppliers => {
        this.StockSuppliers = suppliers;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching stock suppliers:', error);
      }
    );
  }

  captureStock(): void {
    if (this.captureStockForm.valid) {
      const captureStockData: AddStock = this.captureStockForm.value;
      this.stockService.addStock(captureStockData).subscribe(
        response => {
          console.log('Stock captured successfully', response);
          // Optionally, reset form after successful submission
          this.captureStockForm.reset();
        },
        error => {
          console.error('Error capturing stock', error);
        }
      );
    } else {
      // Mark all form fields as touched to display validation errors
      Object.values(this.captureStockForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}

