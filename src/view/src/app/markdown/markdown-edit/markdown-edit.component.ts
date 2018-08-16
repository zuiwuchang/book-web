import { Component, OnInit, Input,ViewChild,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../../core/utils';
import { Book } from '../../core/protocol/book';
import { Title } from "@angular/platform-browser";
@Component({
  selector: 'app-markdown-edit',
  templateUrl: './markdown-edit.component.html',
  styleUrls: ['./markdown-edit.component.css']
})
export class MarkdownEditComponent implements OnInit {
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
  bookInfo:Book = null;
  constructor(private title: Title,
    private http: HttpClient,
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
  @ViewChild('title')
  private titleRef: ElementRef;
  private getTitle(){
    if(!this.titleRef){
      return "Edit";
    }
    return this.titleRef.nativeElement.innerText;
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
        this.bookInfo = book;
        this.title.setTitle(this.getTitle()+" - "+book.Name);
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
