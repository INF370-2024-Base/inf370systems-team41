import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-deliveries',
  templateUrl: './help-deliveries.component.html',
  styleUrls: ['./help-deliveries.component.scss']
})
export class HelpDeliveriesComponent implements OnInit {
  dropdownStates: { [key: string]: boolean } = {
    pageElements: false,
    commonQuestions: false,
    technicalIssues: false
  };

  constructor() { }

  ngOnInit(): void {
  }

  toggleDropdown(section: string) {
    this.dropdownStates[section] = !this.dropdownStates[section]; // Toggle the dropdown state for the specific section
  }

}
