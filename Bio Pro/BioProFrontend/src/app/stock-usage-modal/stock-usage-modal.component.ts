import { Component, OnInit, ChangeDetectorRef , ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { StockServices } from '../services/stock.service';
import { WriteOffModalComponent } from '../write-off-modal/write-off-modal.component';
import { CaptureNewStockModalComponent } from '../capture-new-stock-modal/capture-new-stock-modal.component';
import { DataService } from '../services/login.service';
import { RoleGuardService } from '../services/roleCheck';
import {Stock, StockItems } from '../shared/Stock';
import { forkJoin } from 'rxjs'; // Import forkJoin
Chart.register(...registerables);


interface WeeklyStockUsage {
  week: number;
  totalUsage: number;
  stockDetails: StockItems[];
 
}

@Component({
  selector: 'app-stock-usage-modal',
  templateUrl: './stock-usage-modal.component.html',
  styleUrls: ['./stock-usage-modal.component.scss']
})
export class StockUsageModalComponent implements OnInit {
  @ViewChild('stockLevelChart', { static: true }) stockLevelChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stockUsageChart', { static: true }) stockUsageChartRef!: ElementRef<HTMLCanvasElement>;

  filteredStock: StockItems[] = [];
  belowMinStock: Stock[] = [];
  weeklyStockUsage: WeeklyStockUsage[] = [];
  stockMap: Map<number, string> = new Map();
  stockLevelChart?: Chart; // Separate chart object for stock level chart
  stockUsageChart?: Chart; // Separate chart object for stock usage chart
  stocks: Stock[] = [];
  selectedDate: Date; // Changed to a single date
  selectedWeek: string = '';


  constructor (private stockServices: StockServices, private cdr: ChangeDetectorRef) {
    const today = new Date();
    this.selectedDate = today; // Default to today
   }

  ngOnInit(): void {
    this.fetchStockData();
  }


  fetchStockData(): void {
    forkJoin({
      stockItems: this.stockServices.getStockItems(),
      stocks: this.stockServices.getAllStock()
    }).subscribe(
      ({ stockItems, stocks }) => {
        this.stocks = stocks;
        stocks.forEach((stock: Stock) => {
          this.stockMap.set(stock.stockId, stock.stockName);
          console.log('Fetched Stock Items:', stockItems);
          console.log('Fetched Stocks:', stocks);

        });
        this.stocks = stocks;
        this.populateStockMap(stocks, stockItems);
        
        // Update stock items below minimum level independently
        this.updateBelowMinimumStock();

        // Always create the stock level chart
        this.createStockLevelChart();
        this.updateStockLevelChart(); // Ensure stock levels are displayed

        // Only proceed with weekly usage if a week is selected
        if (this.selectedWeek) {
          const [year, week] = this.selectedWeek.split('-W').map(Number);
          const startOfWeek = this.getStartOfWeekFromWeekNumber(year, week);
          const endOfWeek = this.getEndOfWeekFromWeekNumber(startOfWeek);

          this.filterAndProcessStockData(stockItems);

          this.filteredStock = this.filterStockItemsByWeek(stockItems, startOfWeek, endOfWeek);
          this.processStockItems(this.filteredStock);
          this.createStockUsageChart();
        }

        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  filterStockItemsByWeek(stockItems: StockItems[], startOfWeek: Date, endOfWeek: Date): StockItems[] {
    return stockItems.filter(item => {
      const dateUsed = new Date(item.dateUsed);
      return dateUsed >= startOfWeek && dateUsed <= endOfWeek;
    });
  }
  
  populateStockMap(stocks: Stock[], stockItems: StockItems[]): void {
    // Clear any previous data in stockMap
    this.stockMap.clear();
  
    // Populate the stock map with valid stocks
    stocks.forEach((stock: Stock) => {
      // Ensure stockitemId is a valid number
      const stockId: number = Number(stock.stockId);
  
      if (!isNaN(stockId) && stockId !== undefined && stockId !== null) {
        this.stockMap.set(stockId, stock.stockName.trim());
      } else {
        console.error(`Invalid stockitemId detected:`, stock.stockId, `for stock:`, stock);
      }
    });
  
    console.log('Populated Stock Map:', this.stockMap);
  
    // Process stock items and validate their IDs
    stockItems.forEach((item: StockItems) => {
      const stockId: number = Number(item.StockId);
  
      if (!isNaN(stockId) && stockId !== undefined && stockId !== null) {
        if (this.stockMap.has(stockId)) {
          console.log(`Valid Stock Item:`, item);
          // Further processing or usage here
        } else {
          console.error(`StockId ${stockId} not found in stock map.`);
        }
      } else {
        console.error(`Invalid StockId detected:`, item.StockId, `for stock item:`, item);
      }
    });
  }
  
  
  

  filterAndProcessStockData(stockItems: StockItems[]): void {
    const [year, week] = this.selectedWeek.split('-W').map(Number);
    const startOfWeek = this.getStartOfWeekFromWeekNumber(year, week);
    const endOfWeek = this.getEndOfWeekFromWeekNumber(startOfWeek);
  
    this.filteredStock = this.filterStockItemsByWeek(stockItems, startOfWeek, endOfWeek);
    this.processStockItems(this.filteredStock);
    this.createStockUsageChart();
    this.cdr.detectChanges();
  }

  updateBelowMinimumStock(): void {
    // Filter stocks to find those below the minimum level
    this.belowMinStock = this.stocks.filter(stock => stock.quantityAvailable < stock.minimumStockLevel);
    console.log('Stock Items Below Minimum Level:', this.belowMinStock);
  }
  processStockItems(stockItems: StockItems[]): void {
    stockItems.forEach((item: StockItems) => {
      item.StockId = Number(item.StockId); // Convert StockId to number
  
      if (isNaN(item.StockId) || item.StockId === 0) {
        console.error(`Invalid StockId detected: ${item.StockId}`);
        item.stockName = 'Unknown'; // Default to 'Unknown' for invalid StockId
      } else {
        // Fetch the stock name and log if not found
        const stockName = this.stockMap.get(item.StockId);
        if (!stockName) {
          console.warn(`StockId ${item.StockId} has no matching name in stockMap, defaulting to 'Unknown'.`);
        }
        item.stockName = stockName || 'Unknown';
      }
      item.dateUsed = new Date(item.dateUsed);
    });
  
    console.log('Processed Stock Items:', stockItems);
    console.log('Stock Map:', this.stockMap);
  
    this.groupStockUsageByWeek(stockItems);
  }
  

groupStockUsageByWeek(stockItems: StockItems[]): void {
  const groupedByWeek = stockItems.reduce((acc: { [key: number]: WeeklyStockUsage }, item: StockItems) => {
      const weekNumber = this.getWeekNumber(new Date(item.dateUsed));

      if (!acc[weekNumber]) {
          acc[weekNumber] = {
              week: weekNumber,
              totalUsage: 0,
              stockDetails: []
          };
      }

      // Ensure quantity is a number before adding it
      const quantity = Number(item.quantity) || 0; // Fallback to 0 if NaN or undefined
      acc[weekNumber].totalUsage += quantity;
      acc[weekNumber].stockDetails.push(item);
      return acc;
  }, {} as { [key: number]: WeeklyStockUsage });

  // Check if any data is grouped correctly
  console.log('Grouped weekly data:', groupedByWeek);
  this.weeklyStockUsage = Object.values(groupedByWeek);

  // Additional check to verify the data
  console.log('Weekly stock usage data:', this.weeklyStockUsage);
}
  
  getStartOfWeekFromWeekNumber(year: number, week: number): Date {
    const januaryFirst = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const startOfWeek = new Date(januaryFirst.setDate(januaryFirst.getDate() + days - (januaryFirst.getDay() || 7) + 1));
    return startOfWeek;
  }

  getEndOfWeekFromWeekNumber(startOfWeek: Date): Date {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  }

  getWeekNumber(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.getTime();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    const weekNumber = 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
    return weekNumber;
  }

  createStockUsageChart(): void {
  // Check if there is data to display for the selected week
  if (!this.weeklyStockUsage.length || !this.weeklyStockUsage[0].stockDetails.length) {
    console.error('No weekly stock usage data available for the selected week.');
    
    // Display message to user (optional)
    alert('No stock usage detected for the selected week.');
    
    return;
  }

  // Create a map from StockitemId to stockName with trimmed names
  const stockIdToNameMap = new Map<number, string>();
  this.stocks.forEach(stock => {
    // Ensure stockitemId is valid before using it
    if (typeof stock.stockId !== 'undefined' && stock.stockId !== null) {
      stockIdToNameMap.set(stock.stockId, stock.stockName.trim());
    } else {
      console.error(`Stock entry missing stockId:`, stock);
    }
  });

  console.log('Stock ID to Name Map:', stockIdToNameMap); // Debugging log

  // Update stock names in the weekly stock usage data
  this.weeklyStockUsage.forEach(weekData => {
    weekData.stockDetails.forEach(detail => {
      // Ensure StockId is a valid number
      if (!Number.isNaN(Number(detail.StockId))) {
        detail.StockId = Number(detail.StockId); // Convert to a number
        const mappedName = stockIdToNameMap.get(detail.StockId);

        // Log warning if no matching stock name is found
        if (!mappedName) {
          console.warn(`StockId ${detail.StockId} not found in stockIdToNameMap. Using 'Unknown'.`);
        }
        detail.stockName = mappedName || 'Unknown'; // Assign stockName or 'Unknown'
      } else {
        console.error(`Invalid StockId detected: ${detail.StockId}`);
        detail.stockName = 'Unknown'; // Default to 'Unknown' for invalid StockId
      }
    });
  });

  console.log('Weekly Stock Usage with Names:', this.weeklyStockUsage); // Debugging log

  // Extract stock names and quantities for the chart
  const labels = this.weeklyStockUsage[0].stockDetails.map(detail => detail.stockName || 'Unknown');
  const data = this.weeklyStockUsage[0].stockDetails.map(detail => detail.quantity);

  // Destroy the previous chart if it exists
  if (this.stockUsageChart) {
    this.stockUsageChart.destroy();
  }

  // Get the canvas element for the chart
  const canvas = this.stockUsageChartRef.nativeElement;
  if (!canvas) {
    console.error('Cannot find canvas element for stock usage chart');
    return;
  }

  // Get the context for the chart
  const context = canvas.getContext('2d');
  if (!context) {
    console.error('Unable to get context for chart creation');
    return;
  }

  console.log('Chart data labels:', labels); // Debugging: Log the chart labels
  console.log('Chart data values:', data); // Debugging: Log the chart data

  // Create a chart configuration object
  const chartConfig: ChartConfiguration<'doughnut'> = {
    type: 'doughnut', // Specify chart type
    data: {
      labels: labels,
      datasets: [{
        label: 'Stock Usage',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      cutout: '50%', // Creates the empty center for the doughnut chart
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Stock Usage by Item'
        }
      }
    }
  };

  // Create the chart using the configuration
  this.stockUsageChart = new Chart(context, chartConfig);
}


  
  createStockLevelChart(): void {
    const ctx = this.stockLevelChartRef.nativeElement.getContext('2d') as ChartItem;

    if (this.stockLevelChart) {
      this.stockLevelChart.destroy();
    }

    this.stockLevelChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.stocks.map(stock => stock.stockName),
        datasets: [
          {
            label: 'Quantity Available',
            data: this.stocks.map(stock => stock.quantityAvailable),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Minimum Stock Level',
            data: this.stocks.map(stock => stock.minimumStockLevel),
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
        }
      }
    });
  }

  updateStockLevelChart(): void {
    if (this.stockLevelChart) {
      const belowMinStock = this.stocks.filter(stock => stock.quantityAvailable < stock.minimumStockLevel);

      const labels = belowMinStock.map(stock => stock.stockName);
      const quantityData = belowMinStock.map(stock => stock.quantityAvailable);
      const minStockData = belowMinStock.map(stock => stock.minimumStockLevel);

      console.log('Chart labels:', labels);
      console.log('Chart quantity data:', quantityData);
      console.log('Chart minimum stock data:', minStockData);

      this.stockLevelChart.data.labels = labels;
      this.stockLevelChart.data.datasets[0].data = quantityData;
      this.stockLevelChart.data.datasets[1].data = minStockData;
      this.stockLevelChart.update();
    }
  }

  changeWeek(newWeek: string): void {
    this.selectedWeek = newWeek;
    this.fetchStockData();
  }

}
