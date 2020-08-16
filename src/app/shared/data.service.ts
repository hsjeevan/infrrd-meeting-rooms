import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  bookingData: any;
  optionVal = "all";
  displayArr: any;

  constructor(private http: HttpClient) { }

  async getData() {
    const dbURL = 'http://localhost:3000/bookings'
    await this.http.get(dbURL).subscribe(async data => {
      this.bookingData = await data;
      this.filterRoom(this.optionVal);
    });
  }


  checkAvailability(postData) {
    return this.bookingData.filter((booking: any) => {
      const from = this.getTimeInSeconds(postData.date, postData.fromTime, 'from');
      const to = this.getTimeInSeconds(postData.date, postData.toTime, 'to');
      if ((booking.room === postData.room) &&
        ((from >= booking.fromInSeconds && from <= booking.toInSeconds) ||
          (to >= booking.fromInSeconds && to <= booking.toInSeconds))) {
        return booking;
      }
    });
  }

  filterRoom(value) {
    if (value !== 'all') {
      this.displayArr = this.bookingData.filter(val => {
        if (val.room == value) {
          return val;
        }
      });
    }
    else {
      this.displayArr = [...this.bookingData];
    }
  }
  getTimeInSeconds(day, time, forQuery = '') {
    const dateString = day + ' ' + time;
    const dateObj = new Date(dateString);
    if (forQuery === 'from') {
      dateObj.setSeconds(dateObj.getSeconds() + 1);
    }
    else if (forQuery === 'to') {
      dateObj.setSeconds(dateObj.getSeconds() - 1);
    }
    return dateObj.getTime();
  }

  async delete(id) {
    const dbURL = 'http://localhost:3000/bookings'
    await this.http.delete(dbURL + "/" + id).toPromise();
    this.getData();
  }
}
