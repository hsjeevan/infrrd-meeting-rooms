import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  timeArr = ['09: 00', '09: 30', '10: 00', '10: 30', '11: 00', '11: 30', '12: 00', '12: 30', '13: 00', '13: 30', '14: 00', '14: 30', '15: 00', '15: 30', '16: 00', '16: 30', '17: 00', '17: 30', '18: 00'];

  constructor() { }



  isWeekend(day) {
    const today = new Date(day);
    if (today.getDay() === 6 || today.getDay() === 0) {
      // if (this.isSameDay(day)) {
      //   return false;
      // }
      return true;
    }
    return false;
  }
  isSameDay(day) {
    if (new Date(day).toDateString() === new Date().toDateString()) {
      return true;
    }
    return false;
  }

  getNextMonday(day) {
    const today = new Date(day);
    return this.getDateString(new Date(today.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7)));
  }

  getDateString(date) {
    return new Date(date).toLocaleString('sv', { timeZoneName: 'short' }).split(' ')[0];
  }



}
