import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('1s', style({ transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  weather: any;
  frequentlyVisitedPages: { name: string; route: string; icon: string }[] = [
    { name: 'NEW ORDER', route: '/addOrder', icon: 'assignment' },
    { name: 'ALL ORDERS', route: '/orders', icon: 'folder_open' },
    { name: 'VIEW CALENDAR', route: '/calendar', icon: 'calendar_today' },
    { name: 'DELIVERIES MANAGEMENT', route: '/deliveries', icon: 'delivery_dining' },
    { name: 'STOCK MANAGEMENT', route: '/pageStock', icon: 'stock' },
    { name: 'REPORTS', route: '/reports', icon: 'analytics' },
  ];
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather(): void {
    const apiKey = ' 5bca8bbec1f34810b19221045241807'; // Trail ends  1 Aug 
    const city = 'Pretoria';
    this.http
      .get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
      .subscribe((data) => (this.weather = data));
  }
  
  openModal(): void {
    // Logic to open modal
    const modal = document.getElementById("thankYouModal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  closeModal(): void {
    // Logic to close modal
    const modal = document.getElementById("thankYouModal");
    if (modal) {
      modal.style.display = "none";
    }
  }
}
