import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'holiday'
})
export class HolidayPipe implements PipeTransform {
  transform(description: string, city: string): string {
    const cityNames = city.split('/').map((str) => str.trim());
    return cityNames.reduce(
      (acc, cur) => acc.replace(new RegExp(cur, 'g'), `<strong>${cur}</strong>`),
      description
    );
  }
}
