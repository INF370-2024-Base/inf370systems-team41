import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-help-timeline-of-orders',
  templateUrl: './help-timeline-of-orders.component.html',
  styleUrls: ['./help-timeline-of-orders.component.scss']
})
export class HelpTimelineOfOrdersComponent implements OnInit {
  searchQuery: string = '';
  selectedFilter: string = 'all';
  noResultsFound: boolean = false; 

  dropdownStates: { [key: string]: boolean } = {
    commonQuestions: false,
    technicalIssues: false,
    stepsElements: false,
    
  };

  @ViewChild('searchContent') searchContent!: ElementRef;

  toggleDropdown(section: string): void {
    this.dropdownStates[section] = !this.dropdownStates[section];
  }

  isAnySectionOpen(): boolean {
    return Object.values(this.dropdownStates).some(state => state);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.filterContent();
  }

  onFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedFilter = select.value;
    this.filterContent();
  }

  filterContent(): void {
    const contentElements = this.searchContent.nativeElement.querySelectorAll('.help-container, .searchable');
    let resultsFound = false;
    contentElements.forEach((element: HTMLElement) => {
      const containerType = element.classList.contains('order-timeline-container') ? 'order-timeline-container' :'';
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

  ngOnInit(): void {
    this.filterContent();
  }
}

