import { Component, OnInit } from '@angular/core';
import { ReportsServices } from '../services/reports';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { StockWriteOffViewModel } from '../shared/Stock';
import { OrderTypeWithCount } from '../shared/OrderTypeWithCount';
import { EmployeeMonthlyHours } from '../shared/EmployeeMonthlyHours';
import { StockTypeCountByCategory } from '../shared/StockTypeCountByCategory';
import { StockItemCountByCategory } from '../shared/StockItemCountByCategory';
import Chart from 'chart.js/auto'; 
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe],
})
export class ReportsComponent implements OnInit {
  orders: SystemOrderViewModel[] = [];
  stockTypes: StockTypeCountByCategory[] = [];
  stockItems: StockItemCountByCategory[] = [];
  stockWriteOffs: StockWriteOffViewModel[] = [];
  employeeHours: EmployeeMonthlyHours[] = [];
  totalQuantityWrittenOff: number = 0;
  chart: any;

  constructor(private reportsService: ReportsServices) { }

  ngOnInit(): void {
    this.getAllOrders();
    this.getStockTypesCountByCategory();
    this.getStockItemsCountByCategory();
    this.getAllStockWriteOffs();
    this.getEmployeesWithMonthlyHours();
  }

  getAllOrders() {
    this.reportsService.getAllOrders().subscribe(data => {
      this.orders = data;
    });
  }

  getStockTypesCountByCategory() {
    this.reportsService.getStockTypesCountByCategory().subscribe(data => {
      this.stockTypes = data;
    });
  }

  getStockItemsCountByCategory() {
    this.reportsService.getStockItemsCountByCategory().subscribe(data => {
      this.stockItems = data;
    });
  }

  getAllStockWriteOffs() {
    this.reportsService.getAllStockWriteOffs().subscribe(data => {
      this.stockWriteOffs = data;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.totalQuantityWrittenOff = this.stockWriteOffs.reduce((sum, item) => sum + item.quantityWrittenOff, 0);
  }

  getEmployeesWithMonthlyHours() {
    this.reportsService.getEmployeesWithMonthlyHours().subscribe(data => {
      this.employeeHours = data;
      this.createChart();
    });
  }

  createChart() {
    const labels = this.employeeHours.map(e => e.employeeName); // Corrected property name
    const hours = this.employeeHours.map(e => e.totalMonthlyHours); // Corrected property name

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Hours',
            data: hours,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
