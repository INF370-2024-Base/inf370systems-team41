// dentist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dentist } from '../shared/dentist';
import { EditCalanderEventViewModel } from '../shared/EditCalanderEvent';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'https://localhost:44315/calendar';

  constructor(private httpClient: HttpClient) { }

  

  getAllCalendarEvent(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/GetAllScheduledEvents`);
  }
  updateCalendarEvent(eventToEdit:EditCalanderEventViewModel): Observable<EditCalanderEventViewModel> {
    return this.httpClient.put<EditCalanderEventViewModel>(`${this.apiUrl}/UpdateScheduledEvent`,eventToEdit);
  }
  addCalendarEvent(calendarEvent: EditCalanderEventViewModel): Observable<EditCalanderEventViewModel> {
    return this.httpClient.post<EditCalanderEventViewModel>(`${this.apiUrl}/CreateScheduledEvent`, calendarEvent);
  }
  deleteCalendarEvent(eventId:string): Observable<EditCalanderEventViewModel> {
    return this.httpClient.delete<EditCalanderEventViewModel>(`${this.apiUrl}/DeleteScheduledEvent/${eventId}`);
  }
  getAllCalendars(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/GetAllCalendars`);
  }

  getAllProceduralTimelines(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/GetAllProceduralTimelines`);
  }
}

