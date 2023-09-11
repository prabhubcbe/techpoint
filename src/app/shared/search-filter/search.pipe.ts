import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: any[], searchText: string): any[] {
    if (!value || !searchText) {
      return value;
    }

    searchText = searchText.toLowerCase();

    return value.filter((item) => {
      if (item && typeof item === 'object') {
        const roleName =
          item.role_name && typeof item.role_name === 'string'
            ? item.role_name.toLowerCase()
            : '';
        const userName =
          item.user_name && typeof item.user_name === 'string'
            ? item.user_name.toLowerCase()
            : '';

        return roleName.includes(searchText) || userName.includes(searchText);
      }
      return false; // Skip items that do not have valid properties
    });
  }
}
