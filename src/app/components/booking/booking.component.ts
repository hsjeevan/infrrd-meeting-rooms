import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { TimeService } from '../../shared/time.service';

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
  fromTimeSlots = [...this.timeService.timeArr];
  toTimeSlots = [...this.timeService.timeArr];
  currentDate: any;

  constructor(private timeService: TimeService, private dataService: DataService, private router: Router) { }

  async ngOnInit() {
    this.initializeForm();
    this.subscribeToForm();
    // this.dataService.getData();
  }



  onSubmit() {
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
    let k = this.dataService.checkConflictingBookings(postData);
    if (k.length < 1) {
      this.dataService.getData();
      this.dataService.post(postData)
      this.router.navigate(['/rooms']);
    }
    else {
      console.log('Meeting room unavailable. Please check other slots');
    }
  }

  initializeForm() {
    this.fromTimeSlots.pop();
    this.currentDate = this.timeService.getDateString(new Date());
    if (this.timeService.isWeekend(this.currentDate)) {
      this.currentDate = this.timeService.getNextMonday(this.currentDate);
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
      this.toTimeSlots = this.timeService.timeArr.filter(time => time > val);
    });


    this.bookingForm.get('date').valueChanges.subscribe(val => {
      if (this.timeService.isWeekend(val)) {
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
        this.fromTimeSlots = [...this.timeService.timeArr];
      }
    });
  }
  setFromTimeValue_Slots() {
    this.time = '09: 00';
    if (this.timeService.isSameDay(this.currentDate)) {
      const now = new Date().toTimeString().split(':');
      this.fromTimeSlots = this.fromTimeSlots.filter(time => time > `${now[0]}: ${now[1]}`);
      if (this.fromTimeSlots.length > 0) {
        this.time = this.fromTimeSlots[0];
      }
      else {
        this.setNextDay(this.currentDate);
      }
    }
    this.toTimeSlots = this.timeService.timeArr.filter(time => time > this.time);
  }
  setNextDay(day) {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const newDate = this.timeService.isWeekend(nextDay) ? this.timeService.getNextMonday(day) : this.timeService.getDateString(nextDay);
    this.bookingForm.controls.fromTime.setValue(newDate);
  }



  counter(val) {
    return this.dataService.counter(val);
  }


}
