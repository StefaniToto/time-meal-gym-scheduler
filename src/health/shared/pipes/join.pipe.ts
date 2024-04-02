import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(value: any) {
    return Array.isArray(value) ? value.join(', ') : value;

    // return value.map((x: any) => {
    //   let a = Array.isArray(x.meals) ? x.meals.join(', ') : x.meals;
    //   return a;
    // });
  }
}
