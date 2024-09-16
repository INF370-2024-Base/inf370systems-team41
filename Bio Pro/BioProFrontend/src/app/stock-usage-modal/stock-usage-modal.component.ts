import { Component, OnInit, ChangeDetectorRef , ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart, ChartConfiguration, ChartItem, registerables, ChartType } from 'chart.js';
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
  @ViewChild('quarter1Gauge', { static: true }) quarter1GaugeRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quarter2Gauge', { static: true }) quarter2GaugeRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quarter3Gauge', { static: true }) quarter3GaugeRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quarter4Gauge', { static: true }) quarter4GaugeRef!: ElementRef<HTMLCanvasElement>;
  quarterlyUsage: number[] = [0, 0, 0, 0];
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

  calculateQuarterlyStockUsage(stockItems: StockItems[]): void {
    const quarterlyUsage = [0, 0, 0, 0];
  
    stockItems.forEach((item) => {
      const dateUsed = new Date(item.dateUsed);
      const month = dateUsed.getMonth();
  
      if (item.quantity && !isNaN(Number(item.quantity))) { // Ensure quantity is a valid number
        const quantity = Number(item.quantity);
        if (month >= 0 && month <= 2) {
          quarterlyUsage[0] += quantity; // Q1
        } else if (month >= 3 && month <= 5) {
          quarterlyUsage[1] += quantity; // Q2
        } else if (month >= 6 && month <= 8) {
          quarterlyUsage[2] += quantity; // Q3
        } else if (month >= 9 && month <= 11) {
          quarterlyUsage[3] += quantity; // Q4
        }
      } else {
        console.warn(`Invalid quantity for stock item:`, item);
      }
    });
  
    this.quarterlyUsage = quarterlyUsage;
  
    console.log('Quarterly Stock Usage:', this.quarterlyUsage);
  }
  
  
  createQuarterlyGauges(): void {
    const quarters = [
      { ref: this.quarter1GaugeRef.nativeElement, data: this.quarterlyUsage[0], label: 'Q1' },
      { ref: this.quarter2GaugeRef.nativeElement, data: this.quarterlyUsage[1], label: 'Q2' },
      { ref: this.quarter3GaugeRef.nativeElement, data: this.quarterlyUsage[2], label: 'Q3' },
      { ref: this.quarter4GaugeRef.nativeElement, data: this.quarterlyUsage[3], label: 'Q4' }
    ];
  
    quarters.forEach(quarter => {
      const context = quarter.ref.getContext('2d');
      if (!context) return;
  
      new Chart(context, {
        type: 'doughnut',
        data: {
          labels: [quarter.label],
          datasets: [
            {
              data: [quarter.data, 100 - quarter.data], // Ensure the gauge data is accurate
              backgroundColor: ['#FF6384', '#E0E0E0'],
              borderWidth: 1
            }
          ]
        },
        options: {
          rotation: 270,
          circumference: 180,
          cutout: '70%',
          plugins: {
            tooltip: { enabled: false },
            legend: { display: false }
          }
        }
      });
    });
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
        this.calculateQuarterlyStockUsage(stockItems);
      this.createQuarterlyGauges(); // Create the gauges after calculation

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
    this.stockMap.clear();
  
    // Populate the stock map with valid stocks
    stocks.forEach((stock: Stock) => {
      const stockId: number = Number(stock.stockId);
      if (!isNaN(stockId) && stockId > 0) {
        this.stockMap.set(stockId, stock.stockName.trim());
      } else {
        console.error(`Invalid stockId detected: ${stock.stockId} for stock:`, stock);
      }
    });
  
    console.log('Populated Stock Map:', this.stockMap);
  
    // Validate stock items against the map
    stockItems.forEach((item: StockItems) => {
      const stockId: number = Number(item.StockId);
      if (!isNaN(stockId) && stockId > 0) {
        item.stockName = this.stockMap.get(stockId) || 'Unknown';
      } else {
        console.error(`Invalid StockId detected: ${item.StockId} for stock item:`, item);
        item.stockName = 'Unknown';
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
      // Directly use the stock name from the nested stock object
      if (item.stock && item.stock.stockName) {
        item.stockName = item.stock.stockName.trim(); // Use the stock name from the stock object
      } else {
        console.warn(`StockId ${item.StockId} does not have a valid stock name, defaulting to 'Unknown'.`);
        item.stockName = 'Unknown'; // Default to 'Unknown' if stock or stockName is missing
      }
  
      // Convert dateUsed to a Date object
      item.dateUsed = new Date(item.dateUsed);
    });
  
    console.log('Processed Stock Items:', stockItems);
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
      alert('No stock usage detected for the selected week.');
      return;
    }
  
    // Extract stock names and quantities for the chart
    const labels = this.weeklyStockUsage.flatMap(weekData => 
      weekData.stockDetails.map(detail => detail.stockName || 'Unknown')
    );
  
    const data = this.weeklyStockUsage.flatMap(weekData => 
      weekData.stockDetails.map(detail => detail.quantity)
    );
  
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
  
    // Set the canvas size to 60% of its original size
    // canvas.style.width = '15%';
    // canvas.style.height = '15%';
  
    // Get the context for the chart
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Unable to get context for chart creation');
      return;
    }
  
    // Create a chart configuration object
    const chartConfig: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
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
    this.stockUsageChart = new Chart<'doughnut'>(context, chartConfig);
    console.log('Created stock usage chart:', this.stockUsageChart);
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
