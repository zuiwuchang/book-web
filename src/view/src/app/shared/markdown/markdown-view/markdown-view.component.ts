import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../../utils';
import { Book } from '../../../core/protocol/book';
import { BookService } from '../../../core/monitor/book.service';
import { Title } from "@angular/platform-browser";
import { HighlightJsService } from 'angular2-highlight-js';
@Component({
  selector: 'app-markdown-view',
  templateUrl: './markdown-view.component.html',
  styleUrls: ['./markdown-view.component.css']
})
export class MarkdownViewComponent implements OnInit, OnDestroy {
  readonly InitBook = 0;
  readonly ErrorBook = 1;
  readonly InitChapter = 2;
  readonly ErrorChapter = 3;
  readonly Success = 4;
  status: number = this.InitBook;
  error = null;
  private timer = null;

  private _book: string = '';
  private _chapter: string = '';
  markdown = '';
  constructor(private title: Title,
    private http: HttpClient,
    private bookService: BookService,
  ) { }
  ngOnInit() {
  }
  @Input()
  set book(val: string) {
    this._book = val;
    this.initBook();
  }
  @Input()
  set chapter(val: string) {
    this._chapter = val;
    if (this.status == this.InitChapter || this.status == this.Success || this.status == this.ErrorChapter) {
      this.initChapter();
    }
  }
  private initBook() {
    this.http.post("/book/view", {
      ID: this._book,
    }).subscribe(
      (book: Book) => {
        if (!book) {
          this.error = "unknow result";
          this.status = this.ErrorBook;
        }
        this.bookService.Update(book);
        this.title.setTitle(book.Name);
        this.status = this.InitChapter;
        this.initChapter();
      },
      (e) => {
        this.error = Utils.ResolveError(e);
        this.status = this.ErrorBook;
      },
    )
  }
  private initChapter() {
    this.http.post("/book/chapter", {
      ID: this._book,
      Chapter: this._chapter
    }).subscribe(
      (text: string) => {
        this.markdown = text;
        this.status = this.Success;
      },
      (e) => {
        this.error = Utils.ResolveError(e);
        this.status = this.ErrorChapter;
      },
    );
  }
  ngOnDestroy() {
    this.bookService.Update(null);
  }
  onRetry() {
    this.status = this.InitBook;
    this.timer = setTimeout(() => {
      this.initBook();
      this.closeTimer();
    }, 500);
  }
  private closeTimer() {
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  onRetryChapter() {
    this.status = this.InitChapter;
    this.timer = setTimeout(() => {
      this.initChapter();
      this.closeTimer();
    }, 500);
  }
}
