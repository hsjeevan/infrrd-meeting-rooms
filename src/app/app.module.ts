import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BookingComponent } from './components/booking/booking.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { SlotsComponent } from './components/slots/slots.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BookingComponent,
    RoomsComponent,
    SlotsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
