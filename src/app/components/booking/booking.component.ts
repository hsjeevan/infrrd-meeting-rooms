import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  bookingForm: FormGroup;
  bookingData: any;
  displayArr = [];
  time;
  timeArr = ['09: 00', '09: 30', '10: 00', '10: 30', '11: 00', '11: 30', '12: 00', '12: 30', '13: 00', '13: 30', '14: 00', '14: 30', '15: 00', '15: 30', '16: 00', '16: 30', '17: 00', '17: 30', '18: 00'];
  fromTimeSlots = [...this.timeArr];
  toTimeSlots = [...this.timeArr];
  currentDate: any;

  constructor(private httpClient: HttpClient, private dataService: DataService, private router: Router) { }

  async ngOnInit() {
    this.initializeForm();
    this.subscribeToForm();
    // this.dataService.getData();
  }



  onSubmit() {
    const dbURL = 'http://localhost:3000/bookings';
    const formData = this.bookingForm.value;
    const postData = {
      room: formData.room,
      date: formData.date,
      fromTime: formData.fromTime,
      toTime: formData.toTime,
      name: formData.name,
      agenda: formData.agenda,
      toInSeconds: this.dataService.getTimeInSeconds(formData.date, formData.toTime),
      fromInSeconds: this.dataService.getTimeInSeconds(formData.date, formData.fromTime)
    };
    let k = this.dataService.checkAvailability(postData);
    if (k.length < 1) {
      this.dataService.getData();
      this.router.navigate(['/rooms']);
    }
    else {
      console.log('Meeting room unavailable. Please check other slots');
    }
  }

  initializeForm() {
    this.fromTimeSlots.pop();
    this.currentDate = this.getDateString(new Date());
    if (this.isWeekend(this.currentDate)) {
      this.currentDate = this.getNextMonday(this.currentDate);
    }
    this.setFromTimeValue_Slots();

    this.bookingForm = new FormGroup({
      room: new FormControl(1, Validators.required),
      date: new FormControl(this.currentDate, Validators.required),
      fromTime: new FormControl(this.time, Validators.required),
      toTime: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      agenda: new FormControl(null, Validators.required)
    });
  }

  subscribeToForm() {
    this.bookingForm.get('fromTime').valueChanges.subscribe(val => {
      this.toTimeSlots = this.timeArr.filter(time => time > val);
      console.log(val);
    });


    this.bookingForm.get('date').valueChanges.subscribe(val => {
      if (this.isWeekend(val)) {
        // this.getNextMonday(val);
        this.bookingForm.controls.fromTime.setValue('');
        this.bookingForm.controls.toTime.setValue('');
        this.bookingForm.controls.fromTime.disable();
        this.bookingForm.controls.toTime.disable();
      }
      else {
        if (!this.bookingForm.get('fromTime').value) {
          this.setFromTimeValue_Slots();
          this.bookingForm.controls.fromTime.setValue(this.time);
        }
        this.bookingForm.controls.fromTime.enable();
        this.bookingForm.controls.toTime.enable();
        this.fromTimeSlots = [...this.timeArr];
      }
    });
  }

  setFromTimeValue_Slots() {
    this.time = '09: 00';
    if (this.isSameDay(this.currentDate)) {
      const now = new Date().toTimeString().split(':');
      this.fromTimeSlots = this.fromTimeSlots.filter(time => time > `${now[0]}: ${now[1]}`);
      if (this.fromTimeSlots.length > 0) {
        this.time = this.fromTimeSlots[0];
      }
      else {
        this.setNextDay(this.currentDate);
      }
    }
    this.toTimeSlots = this.timeArr.filter(time => time > this.time);
  }
  setNextDay(day) {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const newDate = this.isWeekend(nextDay) ? this.getNextMonday(day) : this.getDateString(nextDay);
    this.bookingForm.controls.fromTime.setValue(newDate);
  }

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
    const tzoffset = (new Date(date)).getTimezoneOffset() * 60000;
    return (new Date(new Date(date).getTime() - tzoffset)).toISOString().split('T')[0];
  }

  counter(val) {
    return this.dataService.counter(val);
  }


}
