import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class MonthPickerService {
    selectedDate: Date;    
    daysInMonth: number;
    dateChanged = new Subject();   
}