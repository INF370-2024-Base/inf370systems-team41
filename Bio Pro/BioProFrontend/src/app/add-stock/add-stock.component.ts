import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { StockServices } from '../services/stock.service';
import { AddStock } from '../shared/Stock';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent implements OnInit {
  captureStockForm: FormGroup;
  StockCategories: any[] = [];
  StockSuppliers: any[] = [];
  formErrors = {
    maxGreaterThanMin: false,
    nonNegative: false
  };

  constructor(private stockService: StockServices, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.captureStockForm = this.fb.group({
      stockCategoryId: ['', Validators.required],
      supplierId: ['', Validators.required],
      stockName: ['', Validators.required],
      quantityAvailable: ['', [Validators.required, Validators.min(0)]],
      maximumStockLevel: ['', [Validators.required, Validators.min(0)]],
      minimumStockLevel: ['', [Validators.required, Validators.min(0)]],
      reorderPoint: ['', [Validators.required, Validators.min(0)]],
      measurement: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchStockCategoriesAndSuppliers();
    this.setupValueChangeHandlers();
  }

  setupValueChangeHandlers(): void {
    this.captureStockForm.valueChanges.subscribe(() => {
      this.checkValidations();
    });
  }

  checkValidations(): void {
    const form = this.captureStockForm.value;

    this.formErrors.maxGreaterThanMin = form.minimumStockLevel >= form.maximumStockLevel;
    this.formErrors.nonNegative = form.quantityAvailable < 0 || form.maximumStockLevel < 0 || form.minimumStockLevel < 0 || form.reorderPoint < 0;

    if (this.formErrors.maxGreaterThanMin) {
      this.captureStockForm.get('maximumStockLevel')?.setErrors({ maxGreaterThanMin: true });
    } else {
      this.captureStockForm.get('maximumStockLevel')?.setErrors(null);
    }
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
    if (this.captureStockForm.valid && !this.formErrors.maxGreaterThanMin && !this.formErrors.nonNegative) {
      const captureStockData: AddStock = this.captureStockForm.value;
      this.stockService.addStock(captureStockData).subscribe(
        response => {
          console.log('Stock captured successfully', response);
          this.snackBar.open('Successfully added stock item.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.captureStockForm.reset();
          this.router.navigate(['pageStock']);
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
