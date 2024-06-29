import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockServices } from '../services/stock.service';
import { AddStock } from '../shared/Stock';
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
  isLoading: boolean = true;

  constructor(private stockService: StockServices, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;

    this.stockService.getAllStock().subscribe(
      (stockData: any[]) => {
        this.stockService.getAllStockCategories().subscribe(
          (categoryData: any[]) => {
            this.categories = categoryData;
            this.stockList = stockData;
            this.filteredStock = this.stockList.map(stock => ({
              ...stock,
              categoryDescription: this.getCategoryDescription(stock.stockCategoryId)
              
            }));
            console.log(this.filteredStock);
            this.isLoading = false;
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
    this.filteredStock = this.stockList.filter(stock =>
      stock.stockName.toLowerCase().includes(searchTerm) ||
      (this.getCategoryDescription(stock.stockCategoryId) && this.getCategoryDescription(stock.stockCategoryId).toLowerCase().includes(searchTerm))
    );
  }

  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.description : 'Unknown';
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
            console.log('data being sent'+result);
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
