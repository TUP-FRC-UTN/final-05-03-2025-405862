import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '../model/service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'https://679b8dc433d31684632448c9.mockapi.io/services';
  
  constructor(private http: HttpClient) {}

  getServices(origen: string, destino: string, fecha: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}?origin=${origen}&destination=${destino}&departureDate=${fecha}`);
  }
}
