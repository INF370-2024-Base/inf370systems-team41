import { Component, OnInit , ViewChild} from '@angular/core';
import { DeliveryService } from '../services/deliver.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/login.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator'; // Corrected import for MatPaginator



@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  deliveries: any[] = [];
  deliveryStatuses: any[] = [];
  filteredDeliveries: any[] = [];
  pagedDeliveries: any[] = [];
  selectedStatus: string = 'Any';
  searchTerm: string = '';
  pageSize = 6; // Number of deliveries per page
  currentPage = 0; // Current page number

  constructor(private deliveryService: DeliveryService, private snackBar: MatSnackBar,private loginService:DataService) { }

  ngOnInit(): void {
    this.getDeliveries();
    this.getDeliveryStatuses();
  }

  getDeliveries() {
    this.deliveryService.getdeliveries().subscribe(results => {
      this.deliveries = results;
      this.filterDeliveries();
    },
    (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

  getDeliveryStatuses() {
    this.deliveryService.GetDeliveryStatuses().subscribe(results => {
      this.deliveryStatuses = results;
      this.deliveryStatuses.unshift({ status: 'Any' }); // Add "Any" option
      console.log(this.deliveryStatuses);
    },
    (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

  updateDeliveryCollected(id: number) {
    this.deliveryService.UpdateDeliveryCollected(id).subscribe(results => {
      this.loginService.addTransaction("Put","Captured delivery collection. Delivery Id:"+id)
      console.log(this.deliveries);
      this.showSnackbar("Delivery with id:" + id + ", has been updated");
      this.getDeliveries();
    },
    (error: HttpErrorResponse) => {
      this.showSnackbar("Error updating delivery." + error.error);
      console.log(error);
    });
  }

  filterDeliveries() {
    this.filteredDeliveries = this.deliveries.filter(delivery => {
      const matchesStatus = this.selectedStatus === 'Any' || delivery.deliveryStatus?.status === this.selectedStatus;
      const matchesSearch = !this.searchTerm || delivery.deliveryId.toString().includes(this.searchTerm) || delivery.systemOrderId.toString().includes(this.searchTerm);
      return matchesStatus && matchesSearch;
    });
    this.updatePagedDeliveries();
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000 // milliseconds
    });
  }


  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagedDeliveries();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePagedDeliveries();
    }
  }

  // Getter method to calculate total pages
  get totalPages(): number {
    return Math.ceil(this.filteredDeliveries.length / this.pageSize);
  }

  updatePagedDeliveries() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedDeliveries = this.filteredDeliveries.slice(startIndex, endIndex);
  }
}
