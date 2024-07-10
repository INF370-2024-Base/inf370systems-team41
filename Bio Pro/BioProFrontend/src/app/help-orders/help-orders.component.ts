import { Component, OnInit } from '@angular/core';
import {  ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-help-orders',
  templateUrl: './help-orders.component.html',
  styleUrls: ['./help-orders.component.scss']
})
export class HelpOrdersComponent implements OnInit {

  searchQuery: string = '';
  selectedFilter: string = 'all';

  dropdownStates: { [key: string]: boolean } = {
    commonQuestions: false,
    technicalIssues: false,
    stepsElements: false,
    openOrdersCommonQuestions: false,
    openOrdersTechnicalIssues: false,
    awaitingDentalDesignCommonQuestions: false,
    approvedDentalDesign: false,
    approvedOrders: false, //'approved-orders'
  };
  @ViewChild('searchContent') searchContent!: ElementRef;

  toggleDropdown(section: string): void {
    this.dropdownStates[section] = !this.dropdownStates[section];
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.filterContent();
  }

  onFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedFilter = select.value;
  }
  filterContent(): void {
    const contentElements = this.searchContent.nativeElement.querySelectorAll('.help-container, .searchable');
    contentElements.forEach((element: HTMLElement) => {
      const containerType = element.classList.contains('new-orders') ? 'new-orders' :
                            element.classList.contains('open-orders') ? 'open-orders' :
                            element.classList.contains('awaiting-dental-design') ? 'awaiting-dental-design' : 
                            element.classList.contains('approved-dental-design') ? 'approved-dental-design': 
                            element.classList.contains('approved-orders') ? 'approved-orders':'';

      const matchesSearchQuery = element.textContent?.toLowerCase().includes(this.searchQuery);
      const matchesFilter = this.selectedFilter === 'all' || this.selectedFilter === containerType;

      if (matchesSearchQuery && matchesFilter) {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
  }

  shouldDisplayContainer(containerType: string): boolean {
    // Filter by selected filter
    if (this.selectedFilter !== 'all' && this.selectedFilter !== containerType) {
      return false;
    }
    return true;
  }


  ngOnInit(): void {
    this.filterContent();
  }

  // toggleDropdown(section: string) {
  //   this.dropdownStates[section] = !this.dropdownStates[section]; // Toggle the dropdown state for the specific section
  // }
}
