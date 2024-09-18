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
import { DeliveryService } from '../services/deliver.service';
import autoTable from 'jspdf-autotable';
import { DataService } from '../services/login.service';
import {  ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { StockServices } from '../services/stock.service';
import { DentistService } from '../shared/dentist.service'; 
import {StockItems } from '../shared/Stock';
import { forkJoin } from 'rxjs'; // Import forkJoin
Chart.register(...registerables);




@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe],
})
export class ReportsComponent implements OnInit {
  orders: OrderReportViewModel[] = [];
  orderTypeWithCount: OrderTypeWithCount[] = [];
  stockTypes: StockTypeCountByCategory[] = [];
  stockItems: StockItemCountByCategory[] = [];
  stockWriteOffs: StockWriteOffViewModel[] = [];
  totalQuantityWrittenOff: number = 0;
  chart: any;
  employeeHours: any[] = [];
  selectedPeriod: string = 'monthly';
  currentDate: Date = new Date();
  sortColumn: string = 'priorityLevel'; // Default sorting column
  sortDirection: 'asc' | 'desc' = 'asc';
  loggedInUserName: string = '';
  totalDeliveries: number = 0;
  deliveryStatuses: any[] = [];
  recentDeliveries: any[] = [];
  deliveries: any[] = [];
  groupedStockWriteOffs: any[] = [];
  totalOrderCount: number = 0;
  totalTypeCategoryCount: number = 0;
  dentists: any[] = []; // Add a new property for dentists
  totalDentists: number = 0;
  displayedColumns: string[] = ['name', 'contact', 'address'];
  employee: any[]=[];
  totalEmployees: number = 0;
  selectedReport: string = 'all';
  weeklyStockUsage: any[] = [];
  totalEmployeeHoursLogged: number = 0;
  gaugeCharts: any[] = []; // Array to store gauge chart instances
  
  // Orders Pagination
currentPageOrders: number = 1;
itemsPerPageOrders: number = 10;
totalPagesOrders: number = 1;
paginatedOrderList: any[] = []; 

// Dentists Pagination
currentPageDentists: number = 1;
itemsPerPageDentists: number = 10;
totalPagesDentists: number = 1;
paginatedDentistList: any[] = [];

// Employees Pagination
currentPageEmployees: number = 1;
itemsPerPageEmployees: number = 10;
totalPagesEmployees: number = 1;
paginatedEmployeeList: any[] = [];

// Stock Write-Offs Pagination
currentPageStockWriteOffs: number = 1;
itemsPerPageStockWriteOffs: number = 10;
totalPagesStockWriteOffs: number = 1;
paginatedStockWriteOffsList: any[] = [];


  constructor(private reportsService: ReportsServices, 
    private datePipe: DatePipe, 
    private employeeService:EmployeeService,
    private stockServices: StockServices,
    private deliveryService: DeliveryService,private loginService:DataService,
    private dentistService: DentistService  ) { }

    async ngOnInit(): Promise<void> {
      this.getAllOrder();
      this.getStockTypesCountByCategory();
      this.getStockItemsCountByCategory();
      this.getOrderTypesWithOrderCount();
      this.getAllStockWriteOffs();
      this.getEmployeesWithMonthlyHours();
      this.updateChart();
      this.getAllStockWriteOffs();
      this.getDeliveries();
      this.getAllDentists(); 
      this.getAllEmployees();
      this.calculateTotalEmployeeHours();
      this.initializeGauges(); // Initialize gauges
      this.updateGaugeValues(); 
    
      try {
        await this.fetchLoggedInUserName();
        console.log('Logged in user name before download:', this.loggedInUserName); // Log the name for debugging
        // Remove this line
        // this.downloadPDF('ReportName', 'sectionId'); // Replace with actual report name and section ID
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    }


    filterReports(reportId: string) {
      // Get all report sections by their ID
      const reports = document.querySelectorAll('.report-section');
  
      // Loop through all reports and toggle visibility based on the selected report
      reports.forEach((report: any) => {
        if (reportId === 'all') {
          report.style.display = 'block'; // Show all reports if 'No Filter' is selected
        } else {
          report.style.display = report.id === reportId ? 'block' : 'none'; // Show the selected report, hide others
        }
      });
    }

    calculateTotalEmployeeHours() {
      // Check if employeeHours has been populated and has data
      if (this.employeeHours && this.employeeHours.length > 0) {
        // Log the employeeHours data to verify structure
        console.log('Employee Hours Data:', this.employeeHours);
    
        // Calculate total hours and round to the nearest whole number
        this.totalEmployeeHoursLogged = Math.round(
          this.employeeHours.reduce((total, employeeHour) => {
            const hours = employeeHour.totalHours || 0; // Ensure we handle undefined values safely
            return total + hours;
          }, 0)
        );
    
        console.log('Total Employee Hours Logged:', this.totalEmployeeHoursLogged); // Log the result for verification
      } else {
        // Handle case when no data is available
        this.totalEmployeeHoursLogged = 0;
        console.log('No employee hours data available. Total set to 0.');
      }
    }
    
    
    initializeGauges() {
      // Define options for all gauges
      const gaugeOptions: ChartConfiguration<'doughnut', number[], unknown> = {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [0, 100], // Initial data: [current value, remaining percentage]
              backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(200, 200, 200, 0.3)'], // Gauge color and background color
              borderWidth: 0, // Remove border
            },
          ],
        },
        options: {
          responsive: true,
          rotation: -90, // Start from the top
          circumference: 180, // Make it a half-circle
          cutout: '85%', // Make it look like a gauge
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
          },
        },
      };
    
      // Create gauges for each KPI
      this.gaugeCharts = [
        new Chart('gauge1', gaugeOptions),
        new Chart('gauge2', gaugeOptions),
        new Chart('gauge3', gaugeOptions),
        new Chart('gauge4', gaugeOptions),
        new Chart('gauge5', gaugeOptions),
        new Chart('gauge6', gaugeOptions),
      ];
    }
    
    updateGaugeValues() {
      // Fetch data and update gauges
      this.getAllOrder();
      this.getAllStockWriteOffs();
      this.getAllEmployees();
      this.getAllDentists();
      this.getDeliveries();
      this.getEmployeesWithMonthlyHours();
    }

    updateGauge(index: number, currentValue: number, maxValue: number) {
      const percentage = (currentValue / maxValue) * 100;
      this.gaugeCharts[index].data.datasets[0].data = [percentage, 100 - percentage];
      this.gaugeCharts[index].update();
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

  async downloadPDF(reportName: string, sectionId: string) {
    const doc = new jsPDF();
    const logoUrl = 'assets/images/Company logo.jpg'; // Path to your logo image

    // Add logo with adjusted dimensions for better appearance
    doc.addImage(logoUrl, 'JPEG', 10, 10, 40, 20);

    // Set text color to dark grey
    doc.setTextColor(64, 64, 64); // RGB for dark grey

    // Add report title with some space from the logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(reportName, 10, 40); // Adjusted Y coordinate for spacing

    // Add current date
    const formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 10, 50);

    // Add logged-in user
    doc.text(`Downloaded by: ${this.loggedInUserName}`, 10, 60);

    // Reset font to normal for table data
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    let data: any[] = [];
    let columns: string[] = [];

    if (sectionId === 'allOrdersReport') {
      columns = ['Order ID', 'Dentist ID', 'Priority Level', 'Order Date'];
      this.loginService.addTransaction("Generated","Generated all orders report.")
      data = this.orders.map(order => [order.orderId, order.dentistId, order.priorityLevel, this.formatDate(order.dueDate)]);
    } else if (sectionId === 'orderTypesReport') {
      columns = ['Order Type', 'Order Count'];
      data = this.orderTypeWithCount.map(orderType => [orderType.description, orderType.orderCount]);
      // Add total order count at the end of the table
      this.loginService.addTransaction("Generated","Generated ordertype with counts report.")
      data.push(['Total', this.totalOrderCount]);
    } else if (sectionId === 'stockTypesReport') {
      columns = ['Stock Type', 'Type Category Count'];
      data = this.stockTypes.map(stockType => [stockType.description, stockType.stockCategoriesCount]);
      this.loginService.addTransaction("Generated","Generate stock type report.")
      data.push(['Total', this.totalTypeCategoryCount]);
    } else if (sectionId === 'stockItemsReport') {
      columns = ['Stock Category', 'Stock Item Count'];
      this.loginService.addTransaction("Generated","Generated stock category report.")
      data = this.stockItems.map(stockItem => [stockItem.description, stockItem.stockItemsCount]);


    }else if (sectionId === 'stockWriteOffsReport') {
      // Log the generation of the report
      this.loginService.addTransaction("Generated", "Generated stock write-off report.");
  
      // Set up the columns for the report
      columns = ['Stock Name', 'Total Quantity Written Off'];
  
      // Ensure you're working with the full dataset (not paginated data)
      const fullStockWriteOffData = this.groupedStockWriteOffs.map(group => [group.stockName, group.totalQuantityWrittenOff]);
  
      // Add the total row
      fullStockWriteOffData.push(['Total', this.totalQuantityWrittenOff]);
  
     
      autoTable(doc, {
          head: [columns],
          body: fullStockWriteOffData,
          startY: 70, // Adjust starting Y position to ensure it's below the header
          margin: { top: 70 }, // Adjust top margin to avoid overlap with the logo and title
          pageBreak: 'auto', // Automatically insert page breaks when content overflows
          theme: 'grid', // Apply grid styling for better readability
          didDrawCell: (data) => {
              // Highlight the total row by using bold font
              if (data.row.index === data.table.body.length - 1) {
                  doc.setFont('helvetica', 'bold');
                  doc.setFontSize(12);
              }
          }
      });

    } else if (sectionId === 'deliveryReport') {
      // Add total deliveries
      this.loginService.addTransaction("Generated","Generated delivery report.")
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Total Deliveries Captured', 10, 70);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(this.totalDeliveries.toString(), 60, 70);

      // Add deliveries by status
      columns = ['Status', 'Count'];
      data = this.deliveryStatuses.map(status => [status.name, status.count.toString()]);

      autoTable(doc, {
        head: [columns],
        body: data,
        startY: 80,
      });

      // Add recent deliveries
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      const finalY = (doc as any).lastAutoTable.finalY || 80;
      doc.text('Recent Deliveries', 10, finalY + 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      columns = ['Order ID', 'Status'];
      data = this.recentDeliveries.map(delivery => [delivery.systemOrderId, delivery.deliveryStatus?.status]);

      autoTable(doc, {
        head: [columns],
        body: data,
        startY: finalY + 20,
      });
    } else if (sectionId === 'employeeHoursReport') {
      // Handle chart for Employee Hours Report
      this.loginService.addTransaction("Generated","Generated employee hours report.")
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (canvas) {
        const canvasImg = await html2canvas(canvas);
        const imgData = canvasImg.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 70, 180, 90); // Adjust size and position as needed
      } else {
        console.error('Canvas element not found.');
      }
    }
    

    if (sectionId !== 'employeeHoursReport' && sectionId !== 'deliveryReport') {
      autoTable(doc, {
        head: [columns],
        body: data,
        startY: 70, // Moved further down
        didDrawCell: (data) => {
          // Check if this is the last row and make the text bold and larger
          if (data.row.index === data.table.body.length - 1) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
          }
        },
      });
    }
    if (sectionId === 'DentistReport') {
      columns = ['Dentist Name', 'Contact', 'Address'];
      // Ensure correct field names for dentists
      data = this.dentists.map(dentist => [
          `${dentist.firstName} ${dentist.lastName}`, // Full name
          dentist.contactDetail,                      // Contact detail
          dentist.address                             // Address
      ]);

      // Add total dentists row
      data.push(['Total Dentists', '', this.totalDentists.toString()]);
  } else if (sectionId === 'EmployeeReport') {
      columns = ['Employee Name', 'Contact', 'Address'];
      // Ensure correct field names for employees
      data = this.employee.map(employee => [
          `${employee.firstName} ${employee.lastName}`, // Full name
          employee.cellphoneNumber,                     // Phone number
          employee.address                              // Address
      ]);
    }
  
    if (sectionId !== 'employeeHoursReport' && sectionId !== 'deliveryReport') {
      autoTable(doc, {
        head: [columns],
        body: data,
        startY: 70, // Moved further down
        didDrawCell: (data) => {
          // Check if this is the last row and make the text bold and larger
          if (data.row.index === data.table.body.length - 1) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
          }
        },
      });
    }

    doc.save(`${reportName}.pdf`);
}

  // formatDate(date: string): string {
  //   return new Date(date).toLocaleDateString('en-GB');
  // }

  getAllOrder() {
    this.reportsService.getAllOrders().subscribe(
        data => {
            this.orders = data;
            this.sortOrders();
            this.totalOrderCount = data.length;
            this.totalPagesOrders = Math.ceil(this.orders.length / this.itemsPerPageOrders);
      this.currentPageOrders = 1;
      this.updatePaginatedOrders();
      this.updateGauge(0, this.totalOrderCount, 100);
      
        },
        error => {
            console.error('Error fetching orders:', error);
        }
    );
}

updatePaginatedOrders() {
  const startIndex = (this.currentPageOrders - 1) * this.itemsPerPageOrders;
  const endIndex = startIndex + this.itemsPerPageOrders;
  this.paginatedOrderList = this.orders.slice(startIndex, endIndex);  // Update the paginated data
}

nextPageOrders() {
  if (this.currentPageOrders < this.totalPagesOrders) {
    this.currentPageOrders++;
    this.updatePaginatedOrders();  // Update the table data for the new page
  }
}

prevPageOrders() {
  if (this.currentPageOrders > 1) {
    this.currentPageOrders--;
    this.updatePaginatedOrders();  // Update the table data for the new page
  }
}

updatePaginatedDentists() {
  const startIndex = (this.currentPageDentists - 1) * this.itemsPerPageDentists;
  const endIndex = startIndex + this.itemsPerPageDentists;
  this.paginatedDentistList = this.dentists.slice(startIndex, endIndex);
}

nextPageDentists() {
  if (this.currentPageDentists < this.totalPagesDentists) {
    this.currentPageDentists++;
    this.updatePaginatedDentists();
  }
}

prevPageDentists() {
  if (this.currentPageDentists > 1) {
    this.currentPageDentists--;
    this.updatePaginatedDentists();
  }
}



updatePaginatedEmployees() {
  const startIndex = (this.currentPageEmployees - 1) * this.itemsPerPageEmployees;
  const endIndex = startIndex + this.itemsPerPageEmployees;
  this.paginatedEmployeeList = this.employee.slice(startIndex, endIndex);
}

nextPageEmployees() {
  if (this.currentPageEmployees < this.totalPagesEmployees) {
    this.currentPageEmployees++;
    this.updatePaginatedEmployees();
  }
}

prevPageEmployees() {
  if (this.currentPageEmployees > 1) {
    this.currentPageEmployees--;
    this.updatePaginatedEmployees();
  }
}

getAllDentists(): void {
  this.dentistService.getAllDentists().subscribe((data: any[]) => {
    // Sort by first name, then last name
    this.dentists = data.sort((a, b) => {
      return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName);
    });

    // Update total number of dentists
    this.totalDentists = this.dentists.length;
    this.totalPagesDentists = Math.ceil(this.dentists.length / this.itemsPerPageDentists);
    this.currentPageDentists = 1;
    this.updatePaginatedDentists();
    // Update the gauge for Total Dentists
    this.updateGauge(3, this.totalDentists, 100);
  });
}

getAllEmployees(): void {
  this.employeeService.getAllEmployees().subscribe((data: any[]) => {
    // Sort by first name, then last name
    this.employee = data.sort((a, b) => {
      return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName);
    });

    // Set total number of employees
    this.totalEmployees = this.employee.length;
    this.totalPagesEmployees = Math.ceil(this.employee.length / this.itemsPerPageEmployees);
    this.currentPageEmployees = 1;
    this.updatePaginatedEmployees();
    // Update the gauge for Total Employees
    this.updateGauge(2, this.totalEmployees, 100); // Adjust the index if needed
  });
}


getOrderTypesWithOrderCount() {
  this.reportsService.getOrderTypesWithOrderCount().subscribe(
      data => {
          this.orderTypeWithCount = data;
          this.calculateTotalOrderCount();
      },
      error => {
          console.error('Error fetching order types with count:', error);
      }
  );
}
calculateTotalOrderCount(): void {
  this.totalOrderCount = this.orderTypeWithCount.reduce((total, orderType) => total + orderType.orderCount, 0);
}


getStockTypesCountByCategory() {
  this.reportsService.getStockTypesCountByCategory().subscribe(
      data => {
          this.stockTypes = data;
          this.calculateTotalTypeCategoryCount();
      },
      error => {
          console.error('Error fetching stock types count by category:', error);
      }
  );
}
calculateTotalTypeCategoryCount(): void {
  this.totalTypeCategoryCount = this.stockTypes.reduce((total, stockType) => total + stockType.stockCategoriesCount, 0);
}

sortOrders() {
  this.orders.sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (this.sortColumn === 'priorityLevel') {
      // Define priority order
      const priorityOrder = ['High', 'Medium', 'Low'];

      valueA = priorityOrder.indexOf(a.priorityLevel);
      valueB = priorityOrder.indexOf(b.priorityLevel);
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

// updatePaginatedStockWriteOffs() {
//   const startIndex = (this.currentPageStockWriteOffs - 1) * this.itemsPerPageStockWriteOffs;
//   const endIndex = startIndex + this.itemsPerPageStockWriteOffs;
//   this.paginatedStockWriteOffsList = this.stockWriteOffs.slice(startIndex, endIndex);
// }

nextPageStockWriteOffs() {
  if (this.currentPageStockWriteOffs < this.totalPagesStockWriteOffs) {
    this.currentPageStockWriteOffs++;
    this.updatePaginatedStockWriteOffs();
  }
}

prevPageStockWriteOffs() {
  if (this.currentPageStockWriteOffs > 1) {
    this.currentPageStockWriteOffs--;
    this.updatePaginatedStockWriteOffs();
  }
}

getAllStockWriteOffs() {
  this.reportsService.getAllStockWriteOffs().subscribe(
      data => {
          this.stockWriteOffs = data;
          this.groupStockWriteOffs();
          this.totalQuantityWrittenOff = data.reduce((sum, item) => sum + item.quantityWrittenOff, 0);
      this.updateGauge(1, this.totalQuantityWrittenOff, 100);
      this.totalPagesStockWriteOffs = Math.ceil(this.stockWriteOffs.length / this.itemsPerPageStockWriteOffs);
      this.currentPageStockWriteOffs = 1;
      this.updatePaginatedStockWriteOffs();
      this.updateGauge(1, this.totalQuantityWrittenOff, 100);
      },
      error => {
          console.error('Error fetching stock write-offs:', error);
      }
  );
}
groupStockWriteOffs() {
  // Group the stock write-offs by stockName and accumulate totalQuantityWrittenOff
  const grouped: { [key: string]: { stockName: string; totalQuantityWrittenOff: number; details: any[] } } = this.stockWriteOffs.reduce((acc, writeOff) => {
    const stockName = writeOff.stockName;
    if (!acc[stockName]) {
      acc[stockName] = { stockName: stockName, totalQuantityWrittenOff: 0, details: [] };
    }
    acc[stockName].totalQuantityWrittenOff += writeOff.quantityWrittenOff;
    acc[stockName].details.push(writeOff);
    return acc;
  }, {} as { [key: string]: { stockName: string; totalQuantityWrittenOff: number; details: any[] } });

  // Convert the grouped object into an array for display and pagination
  this.groupedStockWriteOffs = Object.values(grouped);

  // Calculate the total quantity written off for all items
  this.calculateTotals();

  // Paginate the grouped stock write-offs
  this.updatePaginatedStockWriteOffs();
}

calculateTotals() {
  this.totalQuantityWrittenOff = this.groupedStockWriteOffs.reduce((sum, group) => sum + group.totalQuantityWrittenOff, 0);
}

updatePaginatedStockWriteOffs() {
  // Handle pagination for the grouped stock write-offs
  const startIndex = (this.currentPageStockWriteOffs - 1) * this.itemsPerPageStockWriteOffs;
  const endIndex = startIndex + this.itemsPerPageStockWriteOffs;

  // Populate the paginated list with the correct slice of the grouped data
  this.paginatedStockWriteOffsList = this.groupedStockWriteOffs.slice(startIndex, endIndex);
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
      this.calculateTotalEmployeeHours();
      const labels = this.employeeHours.map(e => `${e.employee.firstName} ${e.employee.lastName} (${e.employee.employeeId})`);
      const hours = this.employeeHours.map(e => e.totalHours);
      this.createChart(labels, hours, 'Monthly Hours');

      
        // Update the gauge using the calculated total employee hours
    const maxValue = Math.max(this.totalEmployeeHoursLogged, 100); // Adjust maxValue dynamically if necessary
    this.updateGauge(5, this.totalEmployeeHoursLogged, maxValue);
    });
  }
  
  getEmployeesWithWeeklyHours() {
    this.reportsService.getEmployeesWithWeeklyHours().subscribe(data => {
      this.employeeHours = data;
      this.calculateTotalEmployeeHours();
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


  getDeliveries() {
    this.deliveryService.getdeliveries().subscribe(results => {
      this.deliveries = results;
      this.processDeliveries();

      this.totalDeliveries = results.length;
      this.updateGauge(4, this.totalDeliveries, 100);
    });
  }

  processDeliveries() {
    this.totalDeliveries = this.deliveries.length;
    this.calculateDeliveryStatuses();
    this.getRecentDeliveries();
  }

  calculateDeliveryStatuses() {
    const statusCount: { [key: string]: number } = {};
    this.deliveries.forEach(delivery => {
      const status = delivery.deliveryStatus?.status || 'Unknown';
      if (statusCount[status]) {
        statusCount[status]++;
      } else {
        statusCount[status] = 1;
      }
    });
    this.deliveryStatuses = Object.keys(statusCount).map(status => ({
      name: status,
      count: statusCount[status]
    }));
  }
  

  getRecentDeliveries() {
    this.recentDeliveries = this.deliveries
      .sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime())
      .slice(0, 5);
  }

}
