import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadSpinnerService {
  private loading: boolean = false;
  constructor() {}
  setLoading(loading: boolean) {
    this.loading = loading;
    // console.log('loading', loading);
  }

  getLoading(): boolean {
    // console.log('get Loading', this.loading);
    return this.loading;
  }
}
