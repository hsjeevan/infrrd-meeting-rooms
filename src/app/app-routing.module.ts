import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingComponent } from './components/booking/booking.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { SlotsComponent } from './components/slots/slots.component';


const routes: Routes = [
  {path: '', component: BookingComponent},
  {path: 'rooms', component: RoomsComponent},
  {path: 'slots', component: SlotsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
