import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';

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

  newDropdownStates: { [key: string]: boolean } = {
    commonQuestions: false,
    technicalIssues: false,
    steps: false
  };

  constructor(private route: ActivatedRoute, private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {
    
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  @ViewChild('searchContent') searchContent!: ElementRef;

  toggleDropdown(section: string) {
    this.dropdownStates[section] = !this.dropdownStates[section];
  }

  toggleNewDropdown(section: string) {
    this.newDropdownStates[section] = !this.newDropdownStates[section];
  }

  handleExpansionClick(event: Event) {
    event.stopPropagation();
  }

  isAnySectionOpen(): boolean {
    return Object.values(this.dropdownStates).some(state => state) || Object.values(this.newDropdownStates).some(state => state);
  }
  
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.filterContent();
    event.stopPropagation();
  }

  onFilter(event: any) {
    this.selectedFilter = event.value;
    this.filterContent();
  }

  shouldDisplayContainer(containerClass: string): boolean {
    return this.selectedFilter === 'all' || this.selectedFilter === containerClass;
  }

  filterContent() {
    const searchContentElement = this.searchContent.nativeElement;
    const searchableElements = searchContentElement.querySelectorAll('.searchable');
    let found = false;

    searchableElements.forEach((element: any) => {
      const textContent = element.textContent.toLowerCase();
      if (this.searchQuery && textContent.includes(this.searchQuery)) {
        element.style.display = '';
        found = true;
      } else {
        element.style.display = 'none';
      }
    });

    this.noResultsFound = this.searchQuery !== '' && !found;
  }
}


