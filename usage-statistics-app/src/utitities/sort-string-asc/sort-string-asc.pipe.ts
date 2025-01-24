import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'sortStringAsc'
  })
  export class SortStringAscPipe implements PipeTransform {
  
    transform(value: string[]): string[] | null {
      if (!value || value.length <= 1) {
        return value; 
      }
      return value.slice().sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    }
  }