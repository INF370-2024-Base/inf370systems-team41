import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-deliveries',
  templateUrl: './help-deliveries.component.html',
  styleUrls: ['./help-deliveries.component.scss']
})
export class HelpDeliveriesComponent implements OnInit {
  dropdownStates: { [key: string]: boolean } = {
    steps: false,
    commonQuestions: false,
    technicalIssues: false
  };
  newDropdownStates : { [key: string]: boolean } = {
    commonQuestions: false,
    technicalIssues: false,
    steps: false
};

  constructor() { }

  ngOnInit(): void {
  }

  toggleDropdown(section: string) {
    this.dropdownStates[section] = !this.dropdownStates[section]; // Toggle the dropdown state for the specific section
  }

  toggleNewDropdown(section: string) {
    this.newDropdownStates[section] = !this.newDropdownStates[section];
}

}
