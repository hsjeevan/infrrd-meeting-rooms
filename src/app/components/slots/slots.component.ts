import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { TimeService } from '../../shared/time.service';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.scss']
})
export class SlotsComponent implements OnInit {
  fromTimeSlots = [...this.timeService.timeArr];
  toTimeSlots = [...this.timeService.timeArr];
  currentDate: any;
  today = '';
  toValue = '';
  fromValue = this.fromTimeSlots[0];

  availabilityArr = [];

  constructor(private timeService: TimeService, private dataService: DataService) { }

  ngOnInit(): void {
    this.fromTimeSlots.pop();
    this.currentDate = this.timeService.getDateString(new Date());
    this.today = this.currentDate;
    this.computeToArr(this.fromValue);
    // this.toTimeSlots.shift();
  }
  computeToArr(value) {
    this.toTimeSlots = this.timeService.timeArr.filter(time => time > value);
  }

  filterSlots(date, fromTime, toTime) {
    const newArr = new Array(10).fill({ status: 'Available' });
    status = '';
    const from = this.dataService.getTimeInSeconds(date, fromTime, 'from');
    const to = this.dataService.getTimeInSeconds(date, toTime, 'to');
    const now = new Date().getTime();

    this.dataService.bookingData.forEach(booking => {
      if ((from >= booking.fromInSeconds && from <= booking.toInSeconds) ||
        (to >= booking.fromInSeconds && to <= booking.toInSeconds)) {
        newArr[booking.room - 1] = { status: 'Booked', ...booking };
      }
      if (now >= from && now <= to) {
        if (now >= booking.fromInSeconds && now <= booking.toInSeconds) {
          newArr[booking.room - 1] = { status: 'In-Use', ...booking };
        }
      }
    });
    this.availabilityArr = newArr;
  }
}
