import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  disabled:boolean = false;
  book: string = '';
  chapter: string = '';
  constructor() { }
}
