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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EmployeeService } from '../services/employee.service';



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
  currentDate: Date = new Date();
  sortColumn: string = 'priorityLevel'; // Default sorting column
  sortDirection: 'asc' | 'desc' = 'asc'; 
  loggedInUserName: string = '';
  


  constructor(private reportsService: ReportsServices, private datePipe: DatePipe, private employeeService:EmployeeService) { }

  async ngOnInit(): Promise<void>  {
    this.getAllOrder();
    this.getStockTypesCountByCategory();
    this.getStockItemsCountByCategory();
    this.getOrderTypesWithOrderCount();
    this.getAllStockWriteOffs();
    this.getEmployeesWithMonthlyHours();
    this.updateChart();
    
    try {
      await this.fetchLoggedInUserName();
      console.log('Logged in user name before download:', this.loggedInUserName); // Log the name for debugging
      this.downloadPDF('ReportName', 'sectionId'); // Replace with actual report name and section ID
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  }


  fetchLoggedInUserName(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = sessionStorage.getItem('Token');
      console.log('Token:', token);

      if (token) {
        try {
          const parsedToken = JSON.parse(token);
          console.log('Parsed Token:', parsedToken);
          const email = parsedToken.user;

          if (email) {
            this.employeeService.getEmployeeByEmail(email).subscribe(
              (employee) => {
                console.log('Employee Response:', employee);
                if (employee && employee.firstName && employee.lastName) {
                  this.loggedInUserName = `${employee.firstName} ${employee.lastName}`;
                } else {
                  console.error('Invalid employee data:', employee);
                  this.loggedInUserName = 'Unknown User';
                }
                resolve();
              },
              (error) => {
                console.error('Error fetching employee information:', error);
                this.loggedInUserName = 'Unknown User';
                resolve(); // Resolve even if there's an error
              }
            );
          } else {
            console.error('Email not found in token');
            this.loggedInUserName = 'Unknown User';
            resolve(); // Resolve even if email is not found
          }
        } catch (e) {
          console.error('Error parsing token:', e);
          this.loggedInUserName = 'Unknown User';
          resolve(); // Resolve even if there's an error parsing the token
        }
      } else {
        console.error('Token not found');
        this.loggedInUserName = 'Unknown User';
        resolve(); // Resolve even if token is not found
      }
    });
  }

  downloadPDF(reportName: string, sectionId: string) {
    const element = document.getElementById(sectionId);
    const downloadButtons = document.querySelectorAll('.download-button'); // Select all buttons

    if (element) {
      // Hide all download buttons
      downloadButtons.forEach(button => (button as HTMLElement).classList.add('hidden'));

      // Add a slight delay to ensure the button is hidden before capturing
      setTimeout(() => {
        html2canvas(element).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();

          // Add logo
          const logoUrl = 'assets/images/Company logo.jpg'; // Update with your logo path
          pdf.addImage(logoUrl, 'JPEG', 10, 10, 50, 15);

          // Add report content
          pdf.addImage(imgData, 'PNG', 10, 30, 180, 150); // Adjust size and position

          // Add footer with date and user
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Date: ${this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')}`, 10, 270);
          pdf.text(`Downloaded by: ${this.loggedInUserName}`, 10, 280); // Adjust position if needed

          // Save PDF
          pdf.save(`${reportName}.pdf`);

          // Restore all download buttons
          downloadButtons.forEach(button => (button as HTMLElement).classList.remove('hidden'));
        });
      }, 100); // 100ms delay
    }
  }

  getAllOrder() {
    this.reportsService.getAllOrders().subscribe(
        data => {
            this.orders = data;
            this.sortOrders();
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
sortOrders() {
  this.orders.sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (this.sortColumn === 'priorityLevel') {
      valueA = a.priorityLevel;
      valueB = b.priorityLevel;
    } else if (this.sortColumn === 'dueDate') {
      valueA = new Date(a.dueDate);
      valueB = new Date(b.dueDate);
    }

    if (valueA < valueB) {
      return this.sortDirection === 'asc' ? -1 : 1;
    } else if (valueA > valueB) {
      return this.sortDirection === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  });
}

// Method to handle sort change from the UI
onSortChange(column: string) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
  this.sortOrders();
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
      const labels = this.employeeHours.map(e => `${e.employee.firstName} ${e.employee.lastName} (${e.employee.employeeId})`);
      const hours = this.employeeHours.map(e => e.totalHours);
      this.createChart(labels, hours, 'Monthly Hours');
    });
  }
  
  getEmployeesWithWeeklyHours() {
    this.reportsService.getEmployeesWithWeeklyHours().subscribe(data => {
      this.employeeHours = data;
      const labels = this.employeeHours.map(e => `${e.employee.firstName} ${e.employee.lastName} (${e.employee.employeeId})`);
      const hours = this.employeeHours.map(e => e.totalHours);
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
