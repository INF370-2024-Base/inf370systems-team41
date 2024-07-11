import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-help-deliveries',
  templateUrl: './help-deliveries.component.html',
  styleUrls: ['./help-deliveries.component.scss']
})
export class HelpDeliveriesComponent implements OnInit {
  searchQuery: string = '';
  selectedFilter: string = 'all';
  noResultsFound: boolean = false; 

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
    this.filterContent();
  }

  @ViewChild('searchContent') searchContent!: ElementRef;

  toggleDropdown(section: string) {
    this.dropdownStates[section] = !this.dropdownStates[section]; // Toggle the dropdown state for the specific section
  }

  toggleNewDropdown(section: string) {
    this.newDropdownStates[section] = !this.newDropdownStates[section];
 }

 isAnySectionOpen(): boolean {
  return Object.values(this.dropdownStates).some(state => state);
}

onSearch(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.searchQuery = input.value.toLowerCase();
  this.filterContent();
}

filterContent(): void {
  const contentElements = this.searchContent.nativeElement.querySelectorAll('.help-container, .searchable');
  let resultsFound = false;
  contentElements.forEach((element: HTMLElement) => {
    const containerType = element.classList.contains('delivery-container') ? ' delivery-container' :
                          element.classList.contains('new delivery-container') ? 'new delivery-container' : '';

    const matchesSearchQuery = element.textContent?.toLowerCase().includes(this.searchQuery);
    const matchesFilter = this.selectedFilter === 'all' || this.selectedFilter === containerType;

    if (matchesSearchQuery && matchesFilter) {
      element.style.display = '';
      resultsFound = true;
      // Ensure parent containers are displayed if they contain matching elements
      let parent = element.parentElement;
      while (parent && parent !== this.searchContent.nativeElement) {
        if (parent.classList.contains('help-container')) {
          parent.style.display = '';
        }
        parent = parent.parentElement;
      }
    } else {
      element.style.display = 'none';
    }
  });
  this.noResultsFound = !resultsFound;
}

shouldDisplayContainer(containerType: string): boolean {
  return this.selectedFilter === 'all' || this.selectedFilter === containerType;
}


}
