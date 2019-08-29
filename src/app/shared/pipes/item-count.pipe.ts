import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'itemCount' })
export class ItemCountPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'I';
      case 2:
        return 'II';
      default:
        if (value > 2) {
          return 'III';
        } else {
          return '';
        }
    }
  }
}
