import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-employees',
  templateUrl: './help-employees.component.html',
  styleUrls: ['./help-employees.component.scss']
})
export class HelpEmployeesComponent implements OnInit {

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