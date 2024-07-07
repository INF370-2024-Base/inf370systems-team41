import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-deliveries',
  templateUrl: './help-deliveries.component.html',
  styleUrls: ['./help-deliveries.component.scss']
})
export class HelpDeliveriesComponent implements OnInit {
  dropdownOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
 
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen; // Toggle the dropdown state
  }

}
