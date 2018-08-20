import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Book } from '../../core/protocol/book';
import { HighlightJsService } from 'angular2-highlight-js';
import { Markdown } from '../markdown';
import { SettingService } from '../../core/setting/setting.service';
import * as ClipboardJS from 'clipboard/dist/clipboard.min.js'
import { ToasterService } from 'angular2-toaster';
import { Xi18n } from '../../core/xi18n';
declare var MathJax;
class Navigate {
  Name: string
  Book: string
  Chapter: string
  constructor(book: string, chapter: string, name: string) {
    this.Book = book;
    this.Chapter = chapter;
    this.Name = name;
  }
}
@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css']
})
export class MarkdownComponent implements OnInit, AfterViewInit {
  @Input()
  title: string = '';
  previous: Navigate = null;
  next: Navigate = null;
  private xi18n: Xi18n = new Xi18n();
  private update: boolean = false;
  markdown: Markdown = null;
  private _book: Book = null;
  @Input()
  set book(book: Book) {
    this.initNavigate(book, this.settingService.getSetting().ChapterID);
    this._book = book;
  }
  get book(): Book {
    return this._book;
  }

  constructor(private domSanitizer: DomSanitizer,
    private highlightJsService: HighlightJsService,
    private settingService: SettingService,
    private toasterService: ToasterService,
  ) { }
  @Input()
  set val(markdown: string) {
    this.markdown = new Markdown(this.domSanitizer,
      this.settingService.getSetting().BookID,
      this.settingService.getSetting().ChapterID,
      markdown);
    this.initNavigate(this.book, this.settingService.getSetting().ChapterID);
    this.update = true;
  }
  ngOnInit() {
    new ClipboardJS(".btn-clipboard")
  }
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  ngAfterViewInit() {
    this.xi18n.init(this.xi18nRef.nativeElement);
  }
  @ViewChild("view")
  private elementRef: ElementRef
  @ViewChild("btnClipboard")
  private btnClipboard: ElementRef
  @ViewChild("inputClipboard")
  private inputClipboard: ElementRef
  ngAfterViewChecked() {
    if (!this.update) {
      return;
    }
    this.update = false;
    const arrs = this.elementRef.nativeElement.querySelectorAll('code');
    if (arrs && arrs.length != 0) {
      for (let i = 0; i < arrs.length; i++) {
        const item = arrs[i];
        this.highlightJsService.highlight(item);

        // 創建 剪貼板
        if (item.parentElement && (item.parentElement.tagName == "pre" || item.parentElement.tagName == "PRE")) {
          this.createClipboard(item.parentElement, item)
        }
      }
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "MathJax"]);
  }
  private createClipboard(parent, ele) {
    parent.classList.add("code-view");
    const newEle = document.createElement("i")
    newEle.classList.add("fas");
    newEle.classList.add("fa-copy");
    newEle.classList.add("clipboard");
    newEle.onclick = () => {
      //console.log("copy")
      this.inputClipboard.nativeElement.value = ele.innerText;
      // console.log(this.inputClipboard.nativeElement)
      this.btnClipboard.nativeElement.click();
      this.toasterService.pop('info', '', this.xi18n.get("copyied"));
    }
    ele.appendChild(newEle);
  }
  onChange(id) {
    if (!this.elementRef || !this.elementRef.nativeElement) {
      return;
    }
    const ele = this.elementRef.nativeElement.querySelector('#' + id);
    if (!ele) {
      return
    }
    const val = ele.offsetTop;
    window.scroll({
      top: val,
      behavior: "smooth"
    })
  }
  bookID(book: Book) {
    if (book) {
      return book.ID;
    }
    return "";
  }
  isChapter() {
    return this.settingService.getSetting().Chapter;
  }
  isHeader() {
    return this.settingService.getSetting().Header;
  }
  private initNavigate(book: Book, chapter: string) {
    if (!book || !book.Chapter || book.Chapter.length == 0) {
      return;
    }
    this.previous = null;
    this.next = null;
    if (chapter == "0") {
      this.next = new Navigate(book.ID, book.Chapter[0].ID, book.Chapter[0].Name);
      return;
    }
    //pre
    for (let i = 0; i < book.Chapter.length; i++) {
      if (book.Chapter[i].ID == chapter) {
        // previous
        if (i == 0) {
          this.previous = new Navigate(book.ID, "0", book.Name);
        } else {
          this.previous = new Navigate(book.ID, book.Chapter[i - 1].ID, book.Chapter[i - 1].Name);
        }
        if (i + 1 < book.Chapter.length) {
          this.next = new Navigate(book.ID, book.Chapter[i + 1].ID, book.Chapter[i + 1].Name);
        }
        break;
      }
    }
  }
}
