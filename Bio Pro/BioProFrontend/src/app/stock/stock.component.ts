import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { StockServices } from '../services/stock.service';
import { WriteOffModalComponent } from '../write-off-modal/write-off-modal.component';
import { CaptureNewStockModalComponent } from '../capture-new-stock-modal/capture-new-stock-modal.component';
import { DataService } from '../services/login.service';
import { RoleGuardService } from '../services/roleCheck';

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
  searchTerm: string = ''; // Declare searchTerm here
  stockChart?: Chart;
  displayedColumns: string[] = ['stockName', 'quantityAvailable', 'minimumStockLevel'];
  belowMinStock: any[] = [];
  page: number = 1; // Current page

  frequentlyVisitedPages: { name: string; route: string; icon: string }[] = [
    { name: 'ADD STOCK', route: '/addStock', icon: 'add_box' }, // Represents adding items
    { name: 'STOCK TYPE', route: '/stock-type', icon: 'list_alt' }, // Represents a list or type of items
    { name: 'STOCK CATEGORY', route: '/stock-categories', icon: 'category' }, // Represents categories
  ];


  constructor(public roleService:RoleGuardService, private stockService: StockServices, public dialog: MatDialog, private snackBar: MatSnackBar,private dataService:DataService) { }

  ngOnInit(): void {
    this.fetchData();
    setTimeout(() => {
      this.createStockLevelChart();
    }, 0);
  }



  ngOnDestroy(): void {
    // Destroy the chart when the component is destroyed to avoid memory leaks
    if (this.stockChart) {
      this.stockChart.destroy();
    }
  }

  fetchData(): void {
    this.isLoading = true;

    // Fetch all stock data
    this.stockService.getAllStock().subscribe(
      (stockData: any[]) => {
        this.stockList = stockData;
        this.filteredStock = [...this.stockList];
        this.isLoading = false;

        console.log('Fetched stock data:', this.stockList);

        // Ensure the chart is created after the data is fetched
        this.updateChart();

        // Fetch all stock categories
        this.stockService.getAllStockCategories().subscribe(
          (categoryData: any[]) => {
            this.allCategories = categoryData;
            this.categories = [...this.allCategories];

            // Fetch all stock types
            this.stockService.getAllStockTypes().subscribe(
              (typeData: any[]) => {
                this.stockTypes = typeData;
              },
              (error) => {
                console.error('Error fetching stock types:', error);
              }
            );
          },
          (error) => {
            console.error('Error fetching categories:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching stock data:', error);
        this.isLoading = false;
      }
    );
  }

  onSearch(event: any): void {
    this.searchTerm = event;
    this.applyFilters();
  }

  onStockTypeChange(event: any): void {
    this.selectedStockType = event.value;
    this.categories = this.allCategories.filter(category => category.stockTypeId === +this.selectedStockType || this.selectedStockType === '');
    this.selectedCategory = '';
    this.applyFilters();
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredStock = this.stockList.filter(stock => {
      const matchesSearchTerm = stock.stockName.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                                (this.getCategoryDescription(stock.stockCategoryId) && this.getCategoryDescription(stock.stockCategoryId).toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesStockType = this.selectedStockType === '' || this.getStockTypeFromCategory(stock.stockCategoryId) === +this.selectedStockType;
      const matchesCategory = this.selectedCategory === '' || stock.stockCategoryId === +this.selectedCategory;

      return matchesSearchTerm && matchesStockType && matchesCategory;
    });

    // Re-create the chart after applying filters
    this.updateChart();
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStockType = '';
    this.page = 1; // Reset to the first page
    this.applyFilters(); // Reapply filters to reset the filtered stock list
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
            console.log(result)
            this.dataService.addTransaction("Put","Wrote off stock with Id:"+ result.stockId+".Amount written off:"+result.quantityWrittenOff+".Reason:"+result.reason)
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
            console.log(result)
            this.dataService.addTransaction("Put","Captured new stock with id:"+ result.stockId+".Amount added:"+result.amountAdded)
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
  createStockLevelChart(): void {
    const ctx = document.getElementById('stockLevelChart') as ChartItem;

    if (this.stockChart) {
      this.stockChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Quantity Available',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Minimum Stock Level',
            data: [],
            type: 'bar',
            
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            position: 'left',
          },
          // y1: {
          //   beginAtZero: true,
          //   position: 'right',
          //   grid: {
          //     drawOnChartArea: false // only want the grid lines for one axis to show up
          //   }
          // }
        }
      }
    };

    this.stockChart = new Chart(ctx, config);
  }

  updateChart(): void {
    const belowMinStock = this.filteredStock.filter(stock => stock.quantityAvailable < stock.minimumStockLevel);

    const labels = belowMinStock.map(stock => stock.stockName);
    const quantityData = belowMinStock.map(stock => stock.quantityAvailable);
    const minStockData = belowMinStock.map(stock => stock.minimumStockLevel);

    console.log('Chart labels:', labels);
    console.log('Chart quantity data:', quantityData);
    console.log('Chart minimum stock data:', minStockData);

    if (this.stockChart) {
      this.stockChart.data.labels = labels;
      this.stockChart.data.datasets[0].data = quantityData;
      this.stockChart.data.datasets[1].data = minStockData;
      this.stockChart.update();
    }
  }
}
