import { Component } from '@angular/core';

@Component({
  selector: 'app-help-stock',
  templateUrl: './help-stock.component.html',
  styleUrls: ['./help-stock.component.scss']
})
export class HelpStockComponent {
  dropdownStates: { [key: string]: boolean } = {
    stepsElementsSearch: false,
    commonQuestionsSearch: false,
    technicalIssuesSearch: false,
    stepsElementsAdd: false,
    commonQuestionsAdd: false,
    technicalIssuesAdd: false
  };

  constructor() { }

  ngOnInit(): void {
  }

  toggleDropdown(section: string) {
    this.dropdownStates[section] = !this.dropdownStates[section]; // Toggle the dropdown state for the specific section
  }
}
