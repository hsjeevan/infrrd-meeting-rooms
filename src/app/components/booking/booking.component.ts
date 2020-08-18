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
  slotUnavailable = false;
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
    const conflictArr = this.dataService.checkConflictingBookings(postData);
    if (conflictArr.length < 1) {
      this.dataService.post(postData);
      this.router.navigate(['/bookings']);
    }
    else {
      this.slotUnavailable = true;
      // setTimeout(() => {
      //   this.slotUnavailable = false;
      // }, 3000);
      // console.log('Meeting room unavailable. Please check other slots');
    }
  }

  checkDateValidity(control: FormControl): { [s: string]: boolean } {
    if (this.timeService.isWeekend(control.value)) {
      return { 'MeetingUnavailable': true };
    }
    return null;
  }

  initializeForm() {
    this.fromTimeSlots.pop();
    this.currentDate = this.timeService.getDateString(new Date());

    if (this.timeService.isWeekend(this.currentDate)) {
      this.currentDate = this.timeService.getNextMonday(this.currentDate);
    }
    this.bookingForm = new FormGroup({
      room: new FormControl(1, Validators.required),
      date: new FormControl(this.currentDate, [Validators.required, this.checkDateValidity.bind(this)]),
      fromTime: new FormControl(this.time, Validators.required),
      toTime: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      agenda: new FormControl(null, Validators.required)
    });

    this.setFromTimeValue_Slots();
  }

  subscribeToForm() {
    this.bookingForm.get('room').valueChanges.subscribe(val => {
      this.slotUnavailable = false;
    });

    this.bookingForm.get('fromTime').valueChanges.subscribe(val => {
      this.toTimeSlots = this.timeService.timeArr.filter(time => time > val);
      this.slotUnavailable = false;
    });


    this.bookingForm.get('date').valueChanges.subscribe(val => {
      this.slotUnavailable = false;
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
        this.fromTimeSlots.pop();
      }
    });
  }
  setFromTimeValue_Slots() {
    this.time = '09: 00';

    if (this.timeService.isSameDay(this.currentDate)) {
      const now = new Date().toTimeString().split(':');
      this.fromTimeSlots = this.fromTimeSlots.filter(time => time > `${now[0]}: ${now[1]}`);
      if (this.fromTimeSlots.length > 0) {
        this.bookingForm.controls.fromTime.setValue(this.fromTimeSlots[0])
      }
      else {
        this.setNextDay(this.currentDate);
        this.fromTimeSlots = [...this.timeService.timeArr];
        this.fromTimeSlots.pop();
        this.bookingForm.controls.fromTime.setValue(this.time);
      }
    }
    this.toTimeSlots = this.timeService.timeArr.filter(time => time > this.time);
  }
  setNextDay(day) {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const newDate = this.timeService.isWeekend(nextDay) ? this.timeService.getNextMonday(day) : this.timeService.getDateString(nextDay);
    this.bookingForm.controls.date.setValue(newDate);
    this.currentDate = newDate;
  }

  counter(val) {
    return this.dataService.counter(val);
  }


}
