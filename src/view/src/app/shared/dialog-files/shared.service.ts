import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  book: string = '';
  chapter: string = '';
  constructor() { }
}
