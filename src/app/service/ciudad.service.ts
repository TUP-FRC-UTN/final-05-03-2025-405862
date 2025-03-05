import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ciudades } from '../model/ciudades';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private apiUrl = 'https://679b8dc433d31684632448c9.mockapi.io/cities';
  
  constructor(private http: HttpClient) {}

  getCities(): Observable<Ciudades[]> {
    return this.http.get<Ciudades[]>(this.apiUrl);
  }
}
