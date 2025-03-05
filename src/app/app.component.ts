import { Component } from '@angular/core';
import { ReservationComponent } from './reservation/reservation.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  }
