import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockServices } from '../services/stock.service';
import { WriteOffModalComponent } from '../write-off-modal/write-off-modal.component';
import { CaptureNewStockModalComponent } from '../capture-new-stock-modal/capture-new-stock-modal.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stockList: any[] = [];
  filteredStock: any[] = [];
  categories: any[] = [];
  allCategories: any[] = [];
  stockTypes: any[] = [];
  suppliers: any[] = [];
  isLoading: boolean = true;
  selectedCategory: string = '';
  selectedStockType: string = '';

  constructor(private stockService: StockServices, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;

    // Fetch all stock data
    this.stockService.getAllStock().subscribe(
      (stockData: any[]) => {
        this.stockList = stockData;
        this.filteredStock = [...this.stockList];

        // Fetch all stock categories
        this.stockService.getAllStockCategories().subscribe(
          (categoryData: any[]) => {
            this.allCategories = categoryData;
            this.categories = [...this.allCategories];

            // Fetch all stock types
            this.stockService.getAllStockTypes().subscribe(
              (typeData: any[]) => {
                this.stockTypes = typeData;
                this.isLoading = false;
              },
              (error) => {
                console.error('Error fetching stock types:', error);
                this.isLoading = false;
              }
            );
          },
          (error) => {
            console.error('Error fetching categories:', error);
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching stock data:', error);
        this.isLoading = false;
      }
    );
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters(searchTerm);
  }

  onStockTypeChange(event: Event): void {
    this.selectedStockType = (event.target as HTMLSelectElement).value;
    this.categories = this.allCategories.filter(category => category.stockTypeId === +this.selectedStockType || this.selectedStockType === '');
    this.selectedCategory = '';
    this.applyFilters();  // Apply filters based on the selected type
  }

  onCategoryChange(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.applyFilters();  // Apply filters based on the selected category
  }

  applyFilters(searchTerm: string = ''): void {
    this.filteredStock = this.stockList.filter(stock => {
      const matchesSearchTerm = stock.stockName.toLowerCase().includes(searchTerm) || 
                                (this.getCategoryDescription(stock.stockCategoryId) && this.getCategoryDescription(stock.stockCategoryId).toLowerCase().includes(searchTerm));
      const matchesStockType = this.selectedStockType === '' || this.getStockTypeFromCategory(stock.stockCategoryId) === +this.selectedStockType;
      const matchesCategory = this.selectedCategory === '' || stock.stockCategoryId === +this.selectedCategory;

      return matchesSearchTerm && matchesStockType && matchesCategory;
    });
  }

  getCategoryDescription(categoryId: number): string {
    const category = this.allCategories.find(cat => cat.stockCategoryId === categoryId);
    return category ? category.description : 'Unknown';
  }

  getStockTypeFromCategory(categoryId: number): number {
    const category = this.allCategories.find(cat => cat.stockCategoryId === categoryId);
    return category ? category.stockTypeId : null;
  }

  getSupplierName(supplierId: number): string {
    const supplier = this.suppliers.find(sup => sup.supplierId === supplierId);
    return supplier ? supplier.supplierName : 'Unknown';
  }

  openWriteOffModal(stock: any): void {
    const dialogRef = this.dialog.open(WriteOffModalComponent, {
      width: '300px',
      data: { stockId: stock.stockId, stockName: stock.stockName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stockService.addStockWriteOff(result).subscribe(
          response => {
            this.fetchData();
            this.snackBar.open('Stock successfully written off', 'Close', {
              duration: 3000
            });
          },
          error => {
            console.error('Error writing off stock:', error);
            this.snackBar.open('Failed to write off stock', 'Close', {
              duration: 3000
            });
          }
        );
      }
    });
  }

  openCaptureStockModal(stock: any): void {
    const dialogRef = this.dialog.open(CaptureNewStockModalComponent, {
      width: '300px',
      data: { stockId: stock.stockId, stockName: stock.stockName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stockService.captureNewStock(result).subscribe(
          response => {
            this.fetchData();
            this.snackBar.open('Stock successfully captured', 'Close', {
              duration: 3000
            });
          },
          error => {
            console.error('Error capturing new stock:', error);
            this.snackBar.open('Failed to capture new stock', 'Close', {
              duration: 3000
            });
          }
        );
      }
    });
  }
}
