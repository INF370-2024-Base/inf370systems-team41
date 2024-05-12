import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidenavOpen = true;
  isOrdersMenuOpen = false;
  title = 'BioProSystem';
  toggleOrdersMenu(): void {
    this.isOrdersMenuOpen = !this.isOrdersMenuOpen;
  }

}
