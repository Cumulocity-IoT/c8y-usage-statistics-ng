import { MonthPickerComponent } from './month-picker.component';
import { MonthPickerService } from './month-picker.service';

describe('MonthPickerComponent', () => {
  it('parses the displayed MMMM/YYYY value without relying on Date string parsing', () => {
    const service = new MonthPickerService();
    service.selectedDate = new Date(2026, 1, 1);
    const component = new MonthPickerComponent(service);

    expect(component.selectedDate).toBe('February/2026');
    expect(service.selectedDate.getFullYear()).toBe(2026);
    expect(service.selectedDate.getMonth()).toBe(1);
    expect(service.daysInMonth).toBe(28);
  });

  it('defaults to the first day of last month', () => {
    const service = new MonthPickerService();
    new MonthPickerComponent(service);

    const now = new Date();
    const expected = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    expect(service.selectedDate).toEqual(expected);
  });
});
