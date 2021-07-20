import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'strip'})

export class StripPipe implements PipeTransform {
  transform(value: string): string {
    return value.substring(value.lastIndexOf('/')+1);
  }
}