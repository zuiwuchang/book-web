import { Component, OnInit, OnDestroy,ViewChild, ElementRef  } from '@angular/core';
import { Book } from './core/protocol/book';
import { BookService } from './core/monitor/book.service';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  book: Book = null;
  private subscriptionBook: Subscription = null;
  constructor(private bookService: BookService) {
  }
  @ViewChild('sideNav')
  private sideNav: MatSidenav;
  ngOnInit() {
    this.subscriptionBook = this.bookService.Subscribe(
      (book: Book) => {
        if (this.book != book) {
          this.book = book;
          if(!book){
            this.sideNav.close();
          }
        }
      },
      (e) => {
        console.warn(e);
        if (this.subscriptionBook) {
          this.subscriptionBook.unsubscribe();
          this.subscriptionBook = null;
        }
      }
    )
  }
  ngOnDestroy() {
    if (this.subscriptionBook) {
      this.subscriptionBook.unsubscribe();
      this.subscriptionBook = null;
    }
  }
  openSource() {
    window.open("https://gitlab.com/king011/book-web", "_blank");
  }
  bookOk(){
    if(!this.book || !this.book.Chapter || this.book.Chapter.length == 0){
      return false;
    }
    return true;
  }
  bookID(book:Book){
    if(book){
      return book.ID;
    }
    return "";
  }
}
