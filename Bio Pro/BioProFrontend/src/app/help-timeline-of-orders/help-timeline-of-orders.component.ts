import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-timeline-of-orders',
  templateUrl: './help-timeline-of-orders.component.html',
  styleUrls: ['./help-timeline-of-orders.component.scss']
})
export class HelpTimelineOfOrdersComponent implements OnInit {
  dropdownStates: { [key: string]: boolean } = {
    commonQuestions: false,
    technicalIssues: false,
    steps: false
  };

  constructor() { }

  ngOnInit(): void { }

  toggleDropdown(section: string) {
    this.dropdownStates[section] = !this.dropdownStates[section]; // Toggle the dropdown state for the specific section
  }
}



