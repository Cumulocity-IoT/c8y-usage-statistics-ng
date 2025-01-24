
import { TestBed } from '@angular/core/testing';
import { SortStringAscPipe } from './sort-string-asc.pipe'; // Adjust path as needed

describe('SortStringAscPipe', () => {
  let pipe: SortStringAscPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortStringAscPipe], // Add SortStringAscPipe here,
      providers: [
        SortStringAscPipe
    ]
    });
    pipe = TestBed.inject(SortStringAscPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original array if empty or single element', () => {
    const emptyArray: string[] = [];
    const singleElementArray = ['apama'];

    expect(pipe.transform(emptyArray)).toBe(emptyArray);
    expect(pipe.transform(singleElementArray)).toBe(singleElementArray);
  });

  it('should sort the array in ascending order', () => {
    const unsortedArray = ['cellid', 'apama', 'billing'];
    const expectedSortedArray = ['apama', 'billing', 'cellid'];

    expect(pipe.transform(unsortedArray)).toEqual(expectedSortedArray);
  });
});
