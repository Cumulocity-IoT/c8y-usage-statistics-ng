import { Component } from '@angular/core';
import { DATE_FORMAT_MONTH } from '../../../common.service';
import { MonthPickerService } from './month-picker.service';
const moment = require('moment');

@Component({
  selector: 'month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.css']
})
export class MonthPickerComponent {
  selectedDate: string;
  maxDate: Date;

  constructor(
    private monthPickerService: MonthPickerService
  ) {
    this.selectedDate = this.monthPickerService.selectedDate ?
      moment(this.monthPickerService.selectedDate).format(DATE_FORMAT_MONTH) :
      moment().subtract(1, 'months').format(DATE_FORMAT_MONTH);
    this.update()
  }

  ngOnInit() {
    const date = new Date();
    this.maxDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => container._store.dispatch(container._actions.select(event.date));
    container.setViewMode('month');
  }

  update() {
    this.monthPickerService.selectedDate = this.monthPickerService.selectedDate ? new Date(this.selectedDate) : this.getLastMonth();
    this.monthPickerService.daysInMonth = moment(this.selectedDate, DATE_FORMAT_MONTH).daysInMonth() 
    this.monthPickerService.dateChanged.next(this.monthPickerService.selectedDate)
  }

  private getLastMonth() {
    const today = new Date();
    const lastMonthFirstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return lastMonthFirstDay;
  }
}
