import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
 transform(items: any[], value: string): any[] {
   if (!items) {
     return [];
   }
   for (let i = 0; i < items.length; i++) {
     if (items[i].input == null ) {
     items[i].input = '';
    }
         if (items[i].entity == null ) {
     items[i].entity = '';
    }
         if (items[i].intent == null ) {
     items[i].intent = '';
    }
         if (items[i].output == null ) {
     items[i].output = '';
    }
    if (items[i].timestamp == null ) {
     items[i].timestamp = '';
     }
   }
   return items.filter(it => it.input.toLowerCase().includes(value)
   || it.entity.toLowerCase().includes(value)
   || it.intent.toLowerCase().includes(value)
   || it.output.toLowerCase().includes(value)
   || it.timestamp.toLowerCase().includes(value)
   || value === '');
 }
}

