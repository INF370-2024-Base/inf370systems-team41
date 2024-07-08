import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-orders',
  templateUrl: './help-orders.component.html',
  styleUrls: ['./help-orders.component.scss']
})
export class HelpOrdersComponent implements OnInit {

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
