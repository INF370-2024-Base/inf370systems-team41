// dentist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dentist } from '../shared/dentist';
import { AddCalanderEventViewModel } from '../shared/calendarEvent';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'https://localhost:44315/calendar';

  constructor(private httpClient: HttpClient) { }

  addCalendarEvent(calendarEvent: AddCalanderEventViewModel): Observable<AddCalanderEventViewModel> {
    return this.httpClient.post<AddCalanderEventViewModel>(`${this.apiUrl}/CreateCalenderScheduleEvent`, calendarEvent);
  }

  getAllCalendarEvent(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/GetAllScheduledEvents`);
  }
}

