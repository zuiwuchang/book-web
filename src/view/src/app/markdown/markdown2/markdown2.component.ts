import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Book } from '../../core/protocol/book';
import { HighlightJsService } from 'angular2-highlight-js';
import { Markdown } from '../markdown';
import { SettingService } from '../../core/setting/setting.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogErrorComponent } from '../../shared/dialog-error/dialog-error.component';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../../core/utils';
import * as SimpleMDE from 'simplemde';
import { ToasterService } from 'angular2-toaster';
@Component({
  selector: 'app-markdown2',
  templateUrl: './markdown2.component.html',
  styleUrls: ['./markdown2.component.css']
})
export class Markdown2Component implements OnInit, AfterViewInit {
  private update: boolean = false;
  markdown: Markdown = null;
  private oldText = "";
  isVisibility: boolean = true;
  @Input()
  book: Book = null;
  constructor(private domSanitizer: DomSanitizer,
    private highlightJsService: HighlightJsService,
    private settingService: SettingService,
    private router: Router,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private toasterService: ToasterService,
  ) { }
  @Input()
  set val(markdown: string) {
    if (this.oldText === markdown) {
      return;
    }
    this.oldText = markdown;
    if (this.textarea) {
      this.textarea.value(this.oldText);
    }
  }
  ngOnInit() {

  }
  @ViewChild("textarea")
  private textareaRef: ElementRef
  private textarea: any = null;
  ngAfterViewInit() {
    this.textarea = new SimpleMDE({
      // 禁用 圖標下載 已經手動配置
      autoDownloadFontAwesome: false,
      // 指定 document 元素
      element: this.textareaRef.nativeElement,
      // 自定義 預覽 產生 html
      previewRender: (plainText, preview) => {
        this.markdown = new Markdown(null,
          this.settingService.getSetting().BookID,
          this.settingService.getSetting().ChapterID,
          plainText);
        this.update = true;
        return this.markdown.HTML;
      },
      // 關閉 拼寫 
      spellChecker: false,
      // 要隱藏的圖標
      hideIcons: ["guide"],
      // 要顯示的 圖標
      showIcons: ["code", "table"],
      // 定義工具欄目
      toolbar: [
        {
          name: "save",
          className: "fas fa-save",
          title: "Save",
          action: (editor) => {
            this.saveDocument(editor.value());
          },
        },
        {
          name: "file-management",
          className: "fas fa-upload",
          title: "File management",
          action: (editor) => {
            console.log("File management")
          },
        },
        "|", "bold", "italic",
        "|", "code", "quote",
        "|", "unordered-list", "ordered-list",
        "|", "link", {
          name: "image",
          className: "fa fa-image",
          title: "Insert Image",
          action: SimpleMDE.drawImage,
        }, "table",
        "|", "preview", "side-by-side", "fullscreen"
      ]
    });
    this.textarea.value(this.oldText);
    // 監控 全屏 狀態 通知 angular 服務 以便 隱藏阿一些 頂層元素
    this.textarea.codemirror.on("viewportChange", (instance, from, to) => {
      this.settingService.updateFull(this.textarea.isFullscreenActive());
    });
    // console.log(this.textarea)
  }
  @ViewChild("view")
  private elementRef: ElementRef
  ngAfterViewChecked() {
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
    const setting = this.settingService.getSetting();
    return !setting.Full && setting.Chapter;
  }
  isHeader() {
    const setting = this.settingService.getSetting();
    return !setting.Full && setting.Header;
  }
  isFull() {
    return this.settingService.getSetting().Full;
  }
  @ViewChild("msgRouter")
  private msgRouterRef: ElementRef
  onRouter(book: string, chapter: string) {
    if (this.textarea && this.textarea.value() != this.oldText) {
      this.toasterService.pop('error', '', this.msgRouterRef.nativeElement.innerText);
      return;
    }
    this.router.navigate(["/edit", book, chapter]);
  }
  @ViewChild("msgSaveWait")
  private msgSaveWaitRef: ElementRef
  @ViewChild("msgSaveSuccess")
  private msgSaveSuccessRef: ElementRef
  @ViewChild("msgNoChange")
  private msgNoChange: ElementRef
  private waitSave: boolean = false;
  private saveDocument(text: string) {
    if (text == this.oldText) {
      this.toasterService.pop('warning', '', this.msgNoChange.nativeElement.innerText);
      return;
    }
    if (this.waitSave) {
      this.toasterService.pop('error', '', this.msgSaveWaitRef.nativeElement.innerText);
      return;
    }
    const setting = this.settingService.getSetting();

    this.httpClient.post("/book/save", {
      ID: setting.BookID,
      Chapter: setting.ChapterID,
      Val: text,
    }).subscribe(
      () => {
        this.waitSave = false;
        this.oldText = text;
        this.toasterService.pop('success', '', this.msgSaveSuccessRef.nativeElement.innerText);
      },
      (e) => {
        this.waitSave = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    )
  }
  onEditBookName(book) {
    console.log(book)
  }
  onChapterSort(book: Book) {
    if (!book || !book.Chapter || book.Chapter.length == 0) {
      return;
    }

    console.log("sort", book)
  }
  onChapterNew(book: Book) {
    if (!book || !book.Chapter || book.Chapter.length == 0) {
      return;
    }
    console.log("new", book);
  }
  onChapterEdit(book: Book, chapterID: string, chapterName: string) {
    if (!book || !book.Chapter || book.Chapter.length == 0) {
      return;
    }
    console.log("edit", chapterID, chapterName)
  }
  onChapterRemove(book: Book, chapterID: string) {
    if (!book || !book.Chapter || book.Chapter.length == 0) {
      return;
    }
    console.log("remove", chapterID)
  }
}
