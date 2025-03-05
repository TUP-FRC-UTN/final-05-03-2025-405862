import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ciudades } from '../model/ciudades';
import { Service } from '../model/service';
import { CiudadService } from '../service/ciudad.service';
import { ServiceService } from '../service/service.service';
import { ReservationService } from '../service/reservation.service';
import { Reservation } from '../model/reservation';
import { CommonModule } from '@angular/common';
import { debounceTime, map } from 'rxjs/operators';
import { Passager } from '../model/passager';
import { routes } from '../app.routes';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  searchForm: FormGroup;
  reservationForm: FormGroup;
  ciudades: Ciudades[] = [];
  serviciosDisponibles: Service[] = [];

  constructor(
    private fb: FormBuilder,
    private ciudadesService: CiudadService,
    private serviciosService: ServiceService,
    private reservasService: ReservationService,
    private router: Router
  ) {
    
    this.searchForm = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fecha: ['', Validators.required]
    }, { validators: this.sameOriginAndDestinationValidator });

  
    this.reservationForm = this.fb.group({
      servicio: ['', Validators.required],
      document: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]+$')]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      passengers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.ciudadesService.getCities().subscribe(ciudades => {
      this.ciudades = ciudades;
    });
  }

  
  sameOriginAndDestinationValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const origen = formGroup.get('origen')?.value;
    const destino = formGroup.get('destino')?.value;
    return origen === destino ? { sameOriginAndDestination: true } : null;
  }

  get pasajeros(): FormArray {
    return this.reservationForm.get('passengers') as FormArray;
  }

  
  

  buscarServicios(): void {
    if (this.searchForm.valid) {
      const { origen, destino, fecha } = this.searchForm.value;
      this.serviciosService.getServices(origen, destino, fecha).subscribe(servicios => {
        this.serviciosDisponibles = servicios;
      });
    }
  }

  agregarPasajero(): void {
    const pasajeroFormGroup = this.fb.group({
      document: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]+$')]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.pasajeros.push(pasajeroFormGroup);
  }

  confirmarReserva(): void {
    if (this.reservationForm.valid) {
     
      const pasajeroPrincipal: Passager = {
        document: this.reservationForm.value.document,
        firstName: this.reservationForm.value.firstName,
        lastName: this.reservationForm.value.lastName
      };

     
      const reserva: Reservation = {
        document: this.reservationForm.value.document,
        firstName: this.reservationForm.value.firstName,
        lastName: this.reservationForm.value.lastName,
        service: this.reservationForm.value.servicio,
        passengers: [pasajeroPrincipal, ...this.reservationForm.value.passengers], 
        reservationCode: this.generarCodigoReserva(this.reservationForm.value.firstName, this.reservationForm.value.lastName, this.reservationForm.value.document)
      };

      
      this.reservasService.createReservation(reserva).subscribe(response => {
        console.log('Reserva confirmada', response);
        this.router.navigate(['/list']);
      });
    }
  }

  private generarCodigoReserva(nombre: string, apellido: string, documento: string): string {
    const iniciales = `${nombre.charAt(0).toUpperCase()}${apellido.charAt(0).toUpperCase()}`;
    const ultimosDigitos = documento.slice(-3);
    const identificadorUnico = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${iniciales}${ultimosDigitos}-${identificadorUnico}`;
  }
}

