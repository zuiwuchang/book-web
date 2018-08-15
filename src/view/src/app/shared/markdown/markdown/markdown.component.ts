import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Book } from '../../../core/protocol/book';
import { HighlightJsService } from 'angular2-highlight-js';
import { Markdown } from '../markdown';
import { Setting } from '../../../core/setting/setting';
import { SettingService } from '../../../core/setting/setting.service';
@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css']
})
export class MarkdownComponent implements OnInit {
  private update: boolean = false;
  markdown: Markdown = null;
  @Input()
  book: Book = null;
  constructor(private domSanitizer: DomSanitizer,
    private highlightJsService: HighlightJsService,
    private settingService:SettingService,
  ) { }
  @Input()
  set val(markdown: string) {
    this.markdown = new Markdown(this.domSanitizer, markdown);
    this.update = true;
  }
  ngOnInit() {
  }
  @ViewChild("view")
  private elementRef: ElementRef
  ngAfterViewChecked(yes) {
    if (!this.update) {
      return;
    }
    this.update = false;
    const arrs = this.elementRef.nativeElement.querySelectorAll('code');
    if (arrs && arrs.length != 0) {
      for (let i = 0; i < arrs.length; i++) {
        this.highlightJsService.highlight(arrs[i]);
      }
    }
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
}
