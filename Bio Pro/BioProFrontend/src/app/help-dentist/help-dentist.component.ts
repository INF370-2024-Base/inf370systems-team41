import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-dentist',
  templateUrl: './help-dentist.component.html',
  styleUrls: ['./help-dentist.component.scss']
})
export class HelpDentistComponent implements OnInit {

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
