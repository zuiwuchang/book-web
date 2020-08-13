import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Book } from 'src/app/core/protocol';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { Closed, requireDynamic } from 'src/app/core/core/utils';
import { takeUntil } from 'rxjs/operators';
import { Markdown } from '../markdown';
import { DomSanitizer } from '@angular/platform-browser';
import { Loader } from '../loader';
import { MathJaxQueue } from '../mathJax';
import { HighlightJsService } from 'angular2-highlight-js';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { I18nService } from 'src/app/core/i18n/i18n.service';

declare const $: any
class Navigate {
  constructor(public book: string, public chapter: string, public name: string) {
  }
}
@Component({
  selector: 'markdown-markdown-view',
  templateUrl: './markdown-view.component.html',
  styleUrls: ['./markdown-view.component.scss']
})
export class MarkdownViewComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  constructor(private readonly settingsService: SettingsService,
    private readonly i18nService: I18nService,
    private readonly domSanitizer: DomSanitizer,
    private readonly highlightJsService: HighlightJsService,
    private readonly toasterService: ToasterService,
    private readonly router: Router,
  ) { }

  @Input()
  set loader(l: Loader) {
    const opened = l.opened
    const book = l.book
    this.book = book
    const text = l.text
    this.title = l.title
    requireDynamic('showdown').then((showdown) => {
      this.markdown = new Markdown(showdown,
        this.domSanitizer,
        opened.book,
        opened.chapter,
        text,
      )
      this._initNavigate(book, opened.chapter)
      this.update_ = true
    })
  }
  private closed_ = new Closed()
  book: Book
  chapter = false
  header = false
  title: string
  markdown: Markdown
  private update_ = false
  previous: Navigate
  next: Navigate
  private clipboard: any
  ngOnInit(): void {
    this.settingsService.chapterObservable.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe((ok) => {
      this.chapter = ok
    })
    this.settingsService.headerObservable.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe((ok) => {
      this.header = ok
    })
  }
  ngOnDestroy() {
    this.closed_.close()

    if (this.clipboard) {
      this.clipboard.destroy()
    }
    if (this.elementRef.nativeElement) {
      $(this.elementRef.nativeElement).undelegate(".ng-router-a", "click")
    }
  }
  private _initNavigate(book: Book, chapter: string) {
    if (!book || !book.chapter || book.chapter.length == 0) {
      return
    }
    this.previous = null
    this.next = null
    if (chapter == "0") {
      this.next = new Navigate(book.id, book.chapter[0].id, book.chapter[0].name)
      return
    }
    //pre
    for (let i = 0; i < book.chapter.length; i++) {
      if (book.chapter[i].id == chapter) {
        // previous
        if (i == 0) {
          this.previous = new Navigate(book.id, "0", book.name)
        } else {
          this.previous = new Navigate(book.id, book.chapter[i - 1].id, book.chapter[i - 1].name)
        }
        if (i + 1 < book.chapter.length) {
          this.next = new Navigate(book.id, book.chapter[i + 1].id, book.chapter[i + 1].name)
        }
        break
      }
    }
  }
  @ViewChild("view")
  private elementRef: ElementRef
  onChange(id: string) {
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
  @ViewChild("btnClipboard")
  private btnClipboard: ElementRef
  ngAfterViewInit() {
    requireDynamic('clipboard').then((ClipboardJS) => {
      this.clipboard = new ClipboardJS(this.btnClipboard.nativeElement).on('success', () => {
        this.toasterService.pop('info', '', this.i18nService.get("copyied"))
      }).on('error', (evt: any) => {
        console.error('Action:', evt.action);
        console.error('Trigger:', evt.trigger);
      })
    })
    $(this.elementRef.nativeElement).delegate(".ng-router-a", "click", (evt: any) => {
      const url = $(evt.target).attr("href");
      this.router.navigate([url]);
      return false;
    });
  }
  ngAfterViewChecked() {
    if (!this.update_) {
      return
    }
    this.update_ = false
    const arrs = this.elementRef.nativeElement.querySelectorAll('code')
    if (arrs && arrs.length != 0) {
      for (let i = 0; i < arrs.length; i++) {
        const item = arrs[i];
        this.highlightJsService.highlight(item)

        // 創建 剪貼板
        if (item.parentElement && (item.parentElement.tagName == "pre" || item.parentElement.tagName == "PRE")) {
          this.createClipboard(item.parentElement, item)
        }
      }
    }
    MathJaxQueue()
  }
  private createClipboard(parent: any, ele: any) {
    parent.classList.add("code-view");
    const newEle = document.createElement("i")
    newEle.classList.add("fas");
    newEle.classList.add("fa-copy");
    newEle.classList.add("clipboard");
    newEle.onclick = () => {
      this.btnClipboard.nativeElement.setAttribute("data-clipboard-text", $(ele).text().replace(/ /g, " ").trim())
      this.btnClipboard.nativeElement.click();
    }
    ele.appendChild(newEle);
  }
}
