import { Component } from '@angular/core';
import { DATE_FORMAT_MONTH } from '../../../common.service';
import { MonthPickerService } from './month-picker.service';
const moment = require('moment');

@Component({
  standalone: false,
  selector: 'month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.css']
})
export class MonthPickerComponent {
  selectedDate: string | Date;
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
    this.monthPickerService.selectedDate = this.monthPickerService.selectedDate ? this.toDate(this.selectedDate) : this.getLastMonth();
    this.monthPickerService.daysInMonth = moment(this.monthPickerService.selectedDate).daysInMonth()
    this.monthPickerService.dateChanged.next(this.monthPickerService.selectedDate)
  }

  /**
   * The model holds a 'MMMM/YYYY' string until the datepicker replaces it with a Date.
   * new Date('September/2026') only happens to work in Chrome; Firefox and Safari return Invalid Date.
   */
  private toDate(value: string | Date): Date {
    return value instanceof Date ? value : moment(value, DATE_FORMAT_MONTH).toDate();
  }

  private getLastMonth() {
    const today = new Date();
    const lastMonthFirstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return lastMonthFirstDay;
  }
}
