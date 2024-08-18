import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../services/deliver.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  deliveries: any[] = [];
  deliveryStatuses: any[] = [];
  filteredDeliveries: any[] = [];
  selectedStatus: string = 'Any';
  searchTerm: string = '';

  constructor(private deliveryService: DeliveryService, private snackBar: MatSnackBar) { }

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
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000 // milliseconds
    });
  }
}
