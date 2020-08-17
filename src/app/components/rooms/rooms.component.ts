import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy {
  optionVal: string;
  displayArr = [];
  filterRoomSubscription = new Subscription();
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.optionVal = this.dataService.optionVal;
    this.filterRoomSubscription = this.dataService.filterdArrSubject.subscribe((data) => {
      this.displayArr = data;
    });
  }
  ngOnDestroy() {
    this.filterRoomSubscription.unsubscribe();
  }
  filterRoom(val) {
    this.dataService.filterRoom(val);
  }
  counter(val) {
    return this.dataService.counter(val);
  }
  delete(val) {
    this.dataService.delete(val);
  }

}
