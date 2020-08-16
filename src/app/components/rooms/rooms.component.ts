import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  optionVal: string;
  displayArr = [];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.optionVal =  this.dataService.optionVal;
    this.dataService.filterdArrSubject.subscribe((data) => {
      this.displayArr = data;
    });
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
