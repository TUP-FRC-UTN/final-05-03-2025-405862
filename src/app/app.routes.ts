import { Routes } from '@angular/router';
import { ReservationComponent } from './reservation/reservation.component';
import { ListComponent } from './list/list.component';

export const routes: Routes = [
    { path: 'reservation', component: ReservationComponent },
    { path: 'list', component: ListComponent },
    { path: '', redirectTo: '/reservation', pathMatch: 'full' }, 
    { path: '**', redirectTo: '/reservation' } 
  ];
