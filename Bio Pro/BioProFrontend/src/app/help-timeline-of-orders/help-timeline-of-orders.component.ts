import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-timeline-of-orders',
  templateUrl: './help-timeline-of-orders.component.html',
  styleUrls: ['./help-timeline-of-orders.component.scss']
})
export class HelpTimelineOfOrdersComponent implements OnInit {
  dropdownOpen: boolean[] = [false, false, false]; // Array to track the state of each dropdown

  constructor() { }

  ngOnInit(): void { }

  toggleDropdown(index: number) {
    this.dropdownOpen[index] = !this.dropdownOpen[index]; // Toggle the dropdown state
  }


}
