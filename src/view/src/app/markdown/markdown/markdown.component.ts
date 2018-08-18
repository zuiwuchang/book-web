import { Component, OnInit, Input, ViewChild, ElementRef,AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Book } from '../../core/protocol/book';
import { HighlightJsService } from 'angular2-highlight-js';
import { Markdown } from '../markdown';
import { SettingService } from '../../core/setting/setting.service';
import * as ClipboardJS from 'clipboard/dist/clipboard.min.js'
import { ToasterService } from 'angular2-toaster';
import { Xi18n } from '../../core/xi18n';
@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css']
})
export class MarkdownComponent implements OnInit,AfterViewInit {
  private xi18n: Xi18n = new Xi18n();
  private update: boolean = false;
  markdown: Markdown = null;
  @Input()
  book: Book = null;
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
    this.update = true;
  }
  ngOnInit() {
    new ClipboardJS(".btn-clipboard")
  }
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  ngAfterViewInit(){
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
        this.highlightJsService.highlight(arrs[i]);

        // 創建 剪貼板
        if (arrs[i].parentElement && (arrs[i].parentElement.tagName == "pre" || arrs[i].parentElement.tagName == "PRE")) {
          this.createClipboard(arrs[i])
        }
      }
    }
  }
  private createClipboard(ele) {
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
}
