import { Passager } from "./passager";

export interface Reservation {
    document: string;
  firstName: string;
  lastName: string;
  service: string;
  passengers: Passager[];
  reservationCode?: string;
  departureDate?: string;
}
