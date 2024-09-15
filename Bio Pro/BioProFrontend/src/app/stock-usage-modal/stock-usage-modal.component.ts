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
  stockChart?: Chart;
  stocks: Stock[] = [];
 selectedDate: Date; // Changed to a single date
  //stockChart?: Chart;
  displayedColumns: string[] = ['stockName', 'quantityAvailable', 'minimumStockLevel'];
  //belowMinStock: any[] = [];
  selectedWeek: string = ''; 

  constructor (private stockServices: StockServices, private cdr: ChangeDetectorRef) {
    const today = new Date();
    this.selectedDate = today; // Default to today
   }

  ngOnInit(): void {
    this.fetchStockData();
  }


  fetchStockData(): void {
    if (!this.selectedWeek) return; // Ensure a week is selected

    const [year, week] = this.selectedWeek.split('-W').map(Number);
    const startOfWeek = this.getStartOfWeekFromWeekNumber(year, week);
    const endOfWeek = this.getEndOfWeekFromWeekNumber(startOfWeek);

    forkJoin({
      stockItems: this.stockServices.getStockItems(),
      stocks: this.stockServices.getAllStock()
    }).subscribe(
      ({ stockItems, stocks }) => {
        this.stocks = stocks;
        stocks.forEach((stock: Stock) => {
          this.stockMap.set(stock.stockId, stock.stockName);
        });

       
        this.filteredStock = this.filterStockItemsByWeek(stockItems, startOfWeek, endOfWeek);

        this.processStockItems(this.filteredStock);
        this.createStockLevelChart(); // Create the chart initially
        this.updateChart(); // Update the chart with data
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  filterStockItemsByWeek(stockItems: StockItems[], startOfWeek: Date, endOfWeek: Date): StockItems[] {
    return stockItems.filter(item => {
      const dateUsed = new Date(item.DateUsed);
      return dateUsed >= startOfWeek && dateUsed <= endOfWeek;
    });
  }

  processStockItems(stockItems: StockItems[]): void {
    stockItems.forEach((item: StockItems) => {
      item.stockName = this.stockMap.get(item.StockId) || 'Unknown';
      item.DateUsed = new Date(item.DateUsed);
    });

    this.belowMinStock = this.stocks.filter((stock: Stock) => stock.quantityAvailable < stock.minimumStockLevel);

    this.groupStockUsageByWeek(stockItems);
  }

  groupStockUsageByWeek(stockItems: StockItems[]): void {
    const groupedByWeek = stockItems.reduce((acc: { [key: number]: WeeklyStockUsage }, item: StockItems) => {
      const weekNumber = this.getWeekNumber(new Date(item.DateUsed));
      if (!acc[weekNumber]) {
        acc[weekNumber] = {
          week: weekNumber,
          totalUsage: 0,
          stockDetails: []
        };
      }
      acc[weekNumber].totalUsage += item.Quantity;
      acc[weekNumber].stockDetails.push(item);
      return acc;
    }, {} as { [key: number]: WeeklyStockUsage });

    // Check if any data is grouped
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
    const labels = this.weeklyStockUsage.map(item => `Week ${item.week}`);
    const data = this.weeklyStockUsage.map(item => item.totalUsage);

    if (this.stockChart) {
        this.stockChart.destroy();
    }

    const canvas = this.stockUsageChartRef.nativeElement;
    if (!canvas) {
        console.error('Cannot find canvas element for stock usage chart');
        return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
        console.error('Unable to get context for chart creation');
        return;
    }

    // Change the chart type to 'line'
    this.stockChart = new Chart(context, {
        type: 'line', // Set the chart type to 'line'
        data: {
            labels: labels,
            datasets: [{
                label: 'Weekly Stock Usage',
                data: data,
                fill: false, // Do not fill under the line
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.3, // Adds some curve to the line
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
                    text: 'Weekly Stock Usage'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


  changeWeek(newWeek: string): void {
    this.selectedWeek = newWeek;
    this.fetchStockData();
  }

  createStockLevelChart(): void {
    const ctx = this.stockLevelChartRef.nativeElement.getContext('2d') as ChartItem;
  
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
        }
      }
    };
  
    this.stockChart = new Chart(ctx, config);
  }
  
  updateChart(): void {
    const belowMinStock = this.stocks.filter(stock => stock.quantityAvailable < stock.minimumStockLevel);
  
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
