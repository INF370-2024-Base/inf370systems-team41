import { Component, Output, EventEmitter ,Input} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  @Output() searchTermChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() searchTerm: string = '';
  onSearchTermChange(): void {
    this.searchTermChanged.emit(this.searchTerm);
  }
}
