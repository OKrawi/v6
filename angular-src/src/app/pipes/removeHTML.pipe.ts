import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHTML'
})
export class RemoveHTMLPipe implements PipeTransform {
  transform(value: any) {
    return (value) ? String(value).replace(/<[^>]+>/gm, '') : '';
  }
}
