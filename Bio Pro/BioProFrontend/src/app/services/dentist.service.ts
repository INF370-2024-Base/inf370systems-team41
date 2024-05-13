// dentist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dentist } from '../shared/dentist';

@Injectable({
  providedIn: 'root'
})
export class DentistService {
  private apiUrl = 'https://localhost:44315/api/Dentist';

  constructor(private httpClient: HttpClient) { }

  addDentist(dentist: Dentist): Observable<Dentist> {
    return this.httpClient.post<Dentist>(`${this.apiUrl}/AddDentist`, dentist);
  }

  // Add other CRUD operations as needed
}
