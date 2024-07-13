import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-help-orders',
  templateUrl: './help-orders.component.html',
  styleUrls: ['./help-orders.component.scss']
})
export class HelpOrdersComponent implements OnInit, AfterViewInit {

  searchQuery: string = '';
  selectedFilter: string = 'all';
  noResultsFound: boolean = false; 

  dropdownStates: { [key: string]: boolean } = {
    commonQuestions: false,
    technicalIssues: false,
    stepsElements: false,
    openOrdersCommonQuestions: false,
    openOrdersTechnicalIssues: false,
    awaitingDentalDesignCommonQuestions: false,
    approvedDentalDesign: false,
    approvedOrders: false,
    newOrdersCommonQuestions: false,
    newOrdersTechnicalIssues: false,
    newOrdersSteps: false,
    openOrdersSteps: false,
  };

  @ViewChild('searchContent') searchContent!: ElementRef;

  isSearchActive: boolean = false;
  activeDropdown: string | null = null;

  toggleDropdown(section: string): void {
    if (this.isSearchActive) {
      return;
    }
    this.dropdownStates[section] = !this.dropdownStates[section];
    this.activeDropdown = this.dropdownStates[section] ? section : null;
  }

  isAnySectionOpen(): boolean {
    return Object.values(this.dropdownStates).some(state => state);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.filterContent();
  }

  onSearchFocus(): void {
    this.isSearchActive = true;
    // Reopen the active dropdown during search
    if (this.activeDropdown) {
      this.dropdownStates[this.activeDropdown] = true;
    }
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.isSearchActive = false;
    }, 200); // Slight delay to ensure the click event is not missed
  }

  onFilter(event: any): void {
    this.selectedFilter = event.value;
    this.filterContent();
    // Ensure the active dropdown stays open after filtering
    if (this.activeDropdown) {
      this.dropdownStates[this.activeDropdown] = true;
    }
  }

  filterContent(): void {
    if (!this.searchContent) {
      return;
    }
    const contentElements = this.searchContent.nativeElement.querySelectorAll('.help-container, .searchable');
    let resultsFound = false;
    contentElements.forEach((element: HTMLElement) => {
      const containerType = element.classList.contains('new-orders') ? 'new-orders' :
                            element.classList.contains('open-orders') ? 'open-orders' :
                            element.classList.contains('awaiting-dental-design') ? 'awaiting-dental-design' : 
                            element.classList.contains('approved-dental-design') ? 'approved-dental-design': 
                            element.classList.contains('approved-orders') ? 'approved-orders' : '';

      const matchesSearchQuery = element.textContent?.toLowerCase().includes(this.searchQuery);
      const matchesFilter = this.selectedFilter === 'all' || this.selectedFilter === containerType;

      if (matchesSearchQuery && matchesFilter) {
        element.style.display = '';
        resultsFound = true;
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.filterContent();
  } 
}
