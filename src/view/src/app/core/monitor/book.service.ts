import { Injectable } from '@angular/core';
import { Subject, Subscription, PartialObserver } from 'rxjs';
import { Book } from '../protocol/book';
@Injectable({
  providedIn: 'root'
})
export class BookService {
  private subject = new Subject<Book>();
  private book: Book = null;
  constructor() { }

  // 訂閱 書 狀態改變
  Subscribe(nextOrobserver?: (PartialObserver<Book>) | ((value: Book) => void), error?: (error: any) => void, complete?: () => void): Subscription {
    let subscription: Subscription;
    const observable = this.subject.asObservable();
    const observer = nextOrobserver as PartialObserver<Book>;
    if (observer.next || observer.error || observer.complete) {
      subscription = observable.subscribe(observer);
    } else {
      const next = nextOrobserver as (value: Book) => void;
      subscription = observable.subscribe(next, error, complete);
    }
    // 發送 首次 通知
    this.subject.next(this.book);
    return subscription;
  }
  // 更新 當前 書
  Update(book:Book){
    if(this.book != book){
      this.book = book;
    }
    this.subject.next(this.book);
  }
}
