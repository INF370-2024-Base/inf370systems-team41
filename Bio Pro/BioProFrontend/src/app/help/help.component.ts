import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { RoleGuardService } from '../services/roleCheck';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  isPdfEnlarged = false;

  constructor(public roleService: RoleGuardService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }


  togglePdfSize(event: MouseEvent) {
    event.stopPropagation(); // Prevent the event from bubbling up to the overlay
    this.isPdfEnlarged = !this.isPdfEnlarged;
  }

  closePdfSize() {
    this.isPdfEnlarged = false;
  }
}
