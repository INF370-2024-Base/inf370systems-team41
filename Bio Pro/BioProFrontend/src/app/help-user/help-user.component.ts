import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-help-user',
  templateUrl: './help-user.component.html',
  styleUrls: ['./help-user.component.scss']
})
export class HelpUserComponent implements OnInit {

  searchQuery: string = '';
  selectedFilter: string = 'all';
  noResultsFound: boolean = false; 

  dropdownStates: { [key: string]: boolean } = {
    commonQuestionsAddUser: false,
    technicalIssuesAddUser: false,
    stepsElementsAddUser: false,
    commonQuestionsEditUser: false,
    technicalIssuesEditUser: false,
    stepsElementsEditUser: false,
    commonQuestionsSearchUser: false,
    technicalIssuesSearchUser: false,
    stepsElementsSearchUser: false,
    commonQuestionsRevokeUser: false,
    technicalIssuesRevokeUser: false,
    stepsElementsRevokeUser: false,
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

  onFilter(event: MatSelectChange): void {
    this.selectedFilter = event.value;
    this.filterContent();
  }

  filterContent(): void {
    const contentElements = this.searchContent.nativeElement.querySelectorAll('.help-container, .searchable');
    let resultsFound = false;
    contentElements.forEach((element: HTMLElement) => {
      const containerType = element.classList.contains('add-user') ? 'add-user' :
                            element.classList.contains('edit-user') ? 'edit-user' :
                            element.classList.contains('search-user') ? 'search-user' : 
                            element.classList.contains('revoke-user') ? 'revoke-user' : '';
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
