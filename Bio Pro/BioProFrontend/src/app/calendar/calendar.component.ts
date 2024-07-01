import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, NgModule } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay, endOfDay, addDays, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarService } from '../services/calendar.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProcededuralTimelineViewComponent } from '../procededural-timeline-view/procededural-timeline-view.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import { AddEventModalComponent } from '../add-event-modal/add-event-modal.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class CalendarComponent implements OnInit{
  constructor(private calendarService:CalendarService,private snackBar:MatSnackBar,private dialog: MatDialog,private fb: FormBuilder){this.form = this.fb.group({
    Calendar: [''],
    Procedural:['']
  });}
  viewDate: Date = new Date();
  view: 'month' | 'week' = 'week';
  form!: FormGroup;
  CalendarScheduleEvents:any[]=[]
  ProceduralTimelines:any[]=[]
  
  searchTerm: string = '';
  ngOnInit(): void {
    this.fetchCalendarScheduleEvents();
    this.form.get('Calendar')?.valueChanges.subscribe(value => {
      this.onCalendarChange({ value });
    });
    this.form.get('Procedural')?.valueChanges.subscribe(value => {
      this.onTimelineChange({ value });
    });
  }
  events: CalendarEvent[]=[]
  ProceduralTimelinesevents: CalendarEvent[]=[]
calendars:any[]=[]
  fetchCalendarScheduleEvents(): void {
    const colors = ['#ad2121', '#33cc33', '#3366cc', '#ff9900', '#9900cc']; // List of 5 colors to cycle through
    let colorIndex = 0;
    this.calendarService.getAllCalendarEvent().subscribe(
      (result: any[]) => {
        this.events = result.map(item => {
          // Get the current color
          const currentColor = colors[colorIndex];
    
          // Update colorIndex for the next event
          colorIndex = (colorIndex + 1) % colors.length;
    
          return {
            start: new Date(item.calanderScheduleEventDateTime),
            end: addHours(new Date(item.calanderScheduleEventDateTime), 2), // Example end time (adjust as per your requirement)
            title: item.description,
            color: {
              primary: currentColor,
              secondary: `${currentColor}33`, // Add transparency to the color
            },
            object: item,
          };
        });
    
        console.log(this.events); // Logging events for verification
        this.nosearch = this.filteredEvents.length === 0; // Update nosearch flag
        this.refresh.next(this.filteredEvents);
      },
      error => {
        this.showSnackBar('Error fetching events.'+error);
      }
    );

    this.calendarService.getAllProceduralTimelines().subscribe(
      (result: any[]) => {
        this.ProceduralTimelinesevents = result.map(item => {
          // Get the current color
          const currentColor = colors[colorIndex];
    
          // Update colorIndex for the next event
          colorIndex = (colorIndex + 1) % colors.length;
    
          return {
            start: new Date(item.earliestDateTime),
            end: new Date(item.latestDateTime), // Example end time (adjust as per your requirement)
            title: item.timelineDetail,
            color: {
              primary: currentColor,
              secondary: `${currentColor}33`, // Add transparency to the color
            },
            object: item,
          };
        });
    
        console.log(this.events); // Logging events for verification
        this.nosearch = this.filteredEvents.length === 0; // Update nosearch flag
        this.refresh.next(this.filteredEvents);
      },
      error => {
        console.error('Error fetching events', error);
      }
    );
    this.calendarService.getAllCalendars().subscribe(
      (result: any[]) => {
        this.calendars=result
        if (this.calendars.length > 0) {
          this.form.patchValue({ Calendar: this.calendars[0].calanderId });
          this.selectedCalendarId = this.calendars[0].calanderId;
        }
      },
      error => {
        console.error('Error fetching events', error);
      }
    );
  }
  selectedCalendarId:number=1
  onCalendarChange(event: any): void {
    // Handle the change event here
    this.selectedCalendarId = event.value;
    console.log('Selected calendar ID:', this.selectedCalendarId);
    if(this.selectedCalendarId==1)
      {
        this.onSearchTermChange('')
      } 
      if(this.selectedCalendarId==2)
        {
          this.form.patchValue({ Procedural: 'all'});
        }       
  }
  onTimelineChange(event: any): void {
    if (event.value !== 'all') {
      const newSearchTerm=event.value
      this.filteredEvents = this.ProceduralTimelinesevents.filter(event =>
        event.title.toLowerCase()==(newSearchTerm.toLowerCase())
      );
      if(this.filteredEvents.length==0)
        {
          this.nosearch=true
        }
    } else {
      this.filteredEvents = []; 
      this.nosearch=true
    }   
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
            this.showSnackBar("No such events found")
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
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '300px',
      data: { event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh events if an event was edited or deleted
        this.fetchCalendarScheduleEvents();
      }
    });
    console.log('Event clicked:', event);
  }
  addEventClicked(event: any): void {
    const dialogRef = this.dialog.open(AddEventModalComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh events if an event was edited or deleted
        this.fetchCalendarScheduleEvents();
      }
    });
    console.log('Event clicked:', event);
  }
  proceduralTimelineEventClicked(event: any): void {
    const dialogRef = this.dialog.open(ProcededuralTimelineViewComponent, {
      width: '300px',
      data: { event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
    console.log('Event clicked:', event);
  }
  showSnackBar(message:string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000, 
    });
  }
  onViewChange(view: 'week' | 'month'): void {
    this.view = view;
    this.refresh.next(this.CalendarScheduleEvents); // Refresh the view
  }
  
  nextPeriod(): void {
    if (this.view === 'month') {
      this.viewDate = addMonths(this.viewDate, 1);
    } else if (this.view === 'week') {
      this.viewDate = addWeeks(this.viewDate, 1);
    }
    this.refresh.next(this.CalendarScheduleEvents); // Refresh the view
  }
  
  previousPeriod(): void {
    if (this.view === 'month') {
      this.viewDate = subMonths(this.viewDate, 1);
    } else if (this.view === 'week') {
      this.viewDate = subWeeks(this.viewDate, 1);
    }
    this.refresh.next(this.CalendarScheduleEvents); // Refresh the view
  }
  nextPeriodForProc(): void {
    this.viewDate = addMonths(this.viewDate, 1);
    this.refresh.next(this.CalendarScheduleEvents); // Refresh the view
  }
  
  previousPeriodForProc(): void {
    this.viewDate = subMonths(this.viewDate, 1);
    this.refresh.next(this.CalendarScheduleEvents); // Refresh the view
  }
  
  BackToToday()
  {
    this.viewDate=new Date()
  }
}
