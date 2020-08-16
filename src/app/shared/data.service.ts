import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  bookingData: any;
  optionVal = "all";
  displayArr: any;
  bookingDataSubject = new BehaviorSubject([]);
  filterdArrSubject = new BehaviorSubject([]);

  dbURL = 'http://localhost:3000/bookings'
  constructor(private http: HttpClient) { }

  async getData() {
    await this.http.get(this.dbURL).subscribe(async data => {
      this.bookingData = await data;
      this.bookingDataSubject.next(this.bookingData);
      this.filterRoom(this.optionVal);
    });
  }


  checkConflictingBookings(postData) {
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
    this.optionVal = value;
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
    this.filterdArrSubject.next(this.displayArr);
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

  async post(data) {
    await this.http.post(this.dbURL, data).toPromise();
    this.getData();
  }
  async delete(id) {
    await this.http.delete(this.dbURL + "/" + id).toPromise();
    this.getData();
  }
  counter(i: number) {
    return new Array(i);
  }
}

