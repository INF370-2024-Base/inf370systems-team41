import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, NgModule } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay, endOfDay, addDays, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarService } from '../services/calendar.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class CalendarComponent implements OnInit{
  constructor(private calendarService:CalendarService){}
  viewDate: Date = new Date();
  CalendarScheduleEvents:any[]=[]
  searchTerm: string = '';
  ngOnInit(): void {
    this.fetchCalendarScheduleEvents();
  }
  events: CalendarEvent[]=[]

  fetchCalendarScheduleEvents(): void {
    const colors = ['#ad2121', '#33cc33', '#3366cc', '#ff9900', '#9900cc']; // List of 5 colors to cycle through
    let colorIndex = 0;
    this.calendarService.getAllCalendarEvent().subscribe(
      (result: any[]) => {
        this.events = result.map(item => ({
          start: new Date(item.calanderScheduleEventDateTime),
          end: addHours(new Date(item.calanderScheduleEventDateTime), 2), // Example end time (adjust as per your requirement)
          title: item.description,
          color: {
            primary: colors[this.getRandomInt(0, colors.length - 1)],
            secondary: colors[this.getRandomInt(0, colors.length - 1)] + '33' 
          },
          object:item
          
        }));
       
        console.log(this.events); // Logging events for verification
        this.nosearch = this.filteredEvents.length === 0; // Update nosearch flag
        this.refresh.next(this.filteredEvents);
      },
      error => {
        console.error('Error fetching events', error);
      }
    );
  }
  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  filteredEvents: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
nosearch:boolean=true
  onSearchTermChange(searchTerm: string): void {
    if (searchTerm !== '') {
      this.filteredEvents = this.events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.nosearch=false
      if(this.filteredEvents.length==0)
        {
          this.nosearch=true
        }
    } else {
      this.filteredEvents = []; 
      this.nosearch=true
    }
    console.log('Search term:', searchTerm);
    // Trigger change detection manually if needed
    this.refresh.next(this.filteredEvents);
  }
  clearSearch(): void {
    this.onSearchTermChange('');
    this.searchTerm=''
  }
  dayClicked(): void {
    console.log('Day clicked');
  }

  eventClicked(event: any): void {
    console.log('Event clicked:', event);
  }
}
