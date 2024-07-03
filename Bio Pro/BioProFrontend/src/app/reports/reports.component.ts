import {Component, OnInit} from '@angular/core';
import { ReportsServices } from '../services/reports';
//import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { StockWriteOffViewModel } from '../shared/Stock';
import { EmployeeMonthlyHours } from '../shared/EmployeeMonthlyHours';
import { StockTypeCountByCategory } from '../shared/StockTypeCountByCategory';
import { StockItemCountByCategory } from '../shared/StockItemCountByCategory';
import Chart from 'chart.js/auto'; 
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderTypeWithCount } from '../shared/OrderTypeWithCount';
import { OrderReportViewModel } from '../shared/OrderReportViewModel';



@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe],
})
export class ReportsComponent implements OnInit {
  orders: OrderReportViewModel[] = [];
  orderTypeWithCount: OrderTypeWithCount[] =[];
  stockTypes: StockTypeCountByCategory[] = [];
  stockItems: StockItemCountByCategory[] = [];
  stockWriteOffs: StockWriteOffViewModel[] = [];
  //employeeHours: EmployeeMonthlyHours[] = [];
  totalQuantityWrittenOff: number = 0;
  chart: any;
  employeeHours: any[] = [];
  selectedPeriod: string = 'monthly';

  constructor(private reportsService: ReportsServices, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getAllOrder();
    this.getStockTypesCountByCategory();
    this.getStockItemsCountByCategory();
    this.getOrderTypesWithOrderCount();
    this.getAllStockWriteOffs();
    this.getEmployeesWithMonthlyHours();
    this.updateChart();
  }

  getAllOrder() {
    this.reportsService.getAllOrders().subscribe(
        data => {
            this.orders = data;
        },
        error => {
            console.error('Error fetching orders:', error);
        }
    );
}

getOrderTypesWithOrderCount() {
  this.reportsService.getOrderTypesWithOrderCount().subscribe(
      data => {
          this.orderTypeWithCount = data;
      },
      error => {
          console.error('Error fetching order types with count:', error);
      }
  );
}
getStockTypesCountByCategory() {
  this.reportsService.getStockTypesCountByCategory().subscribe(
      data => {
          this.stockTypes = data;
      },
      error => {
          console.error('Error fetching stock types count by category:', error);
      }
  );
}

getStockItemsCountByCategory() {
  this.reportsService.getStockItemsCountByCategory().subscribe(
      data => {
          this.stockItems = data;
      },
      error => {
          console.error('Error fetching stock items count by category:', error);
      }
  );
}

getAllStockWriteOffs() {
  this.reportsService.getAllStockWriteOffs().subscribe(
      data => {
          this.stockWriteOffs = data;
          this.calculateTotals();
      },
      error => {
          console.error('Error fetching stock write-offs:', error);
      }
  );
}

  calculateTotals() {
    this.totalQuantityWrittenOff = this.stockWriteOffs.reduce((sum, item) => sum + item.quantityWrittenOff, 0);
  }

  updateChart() {
    if (this.selectedPeriod === 'monthly') {
      this.getEmployeesWithMonthlyHours();
    } else if (this.selectedPeriod === 'weekly') {
      this.getEmployeesWithWeeklyHours();
    }
  }

  getEmployeesWithMonthlyHours() {
    this.reportsService.getEmployeesWithMonthlyHours().subscribe(data => {
      this.employeeHours = data;
      const labels = this.employeeHours.map(e => `${e.firstName} ${e.lastName}`);
      const hours = this.employeeHours.map(e => e.totalHours);
      this.createChart(labels, hours, 'Monthly Hours');
    });
  }

 getEmployeesWithWeeklyHours() {
  this.reportsService.getEmployeesWithWeeklyHours().subscribe(data => {
    this.employeeHours = data;
    const labels = this.employeeHours.map(e => `${e.firstName} ${e.lastName} `);
    const hours = this.employeeHours.map(e => e.week);
    this.createChart(labels, hours, 'Weekly Hours');
  });
}

  createChart(labels: string[], data: number[], label: string) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
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

  formatDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); 
  }

}
