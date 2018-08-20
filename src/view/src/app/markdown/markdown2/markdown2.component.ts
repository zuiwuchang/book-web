import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Book } from '../../core/protocol/book';
import { HighlightJsService } from 'angular2-highlight-js';
import { Markdown } from '../markdown';
import { SettingService } from '../../core/setting/setting.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogFilesComponent } from '../../shared/dialog-files/dialog-files.component';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../../core/utils';
import * as SimpleMDE from 'simplemde';
import { ToasterService } from 'angular2-toaster';
import { DialogSureComponent } from '../../shared/dialog-sure/dialog-sure.component';
import { DialogChapterComponent } from '../../shared/dialog-chapter/dialog-chapter.component';
import { Xi18n } from '../../core/xi18n';
import * as ClipboardJS from 'clipboard/dist/clipboard.min.js'
import { DialogUploadComponent } from '../../shared/dialog-upload/dialog-upload.component';
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
  selector: 'app-markdown2',
  templateUrl: './markdown2.component.html',
  styleUrls: ['./markdown2.component.css']
})
export class Markdown2Component implements OnInit, AfterViewInit {
  previous: Navigate = null;
  next: Navigate = null;
  private xi18n: Xi18n = new Xi18n();
  private update: boolean = false;
  markdown: Markdown = null;
  private oldText = "";
  isVisibility: boolean = true;
  isRequest = false;
  private _book: Book = null;
  @Input()
  title: string = '';
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
    this.initNavigate(this.book, this.settingService.getSetting().ChapterID);
  }
  ngOnInit() {
  }
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  @ViewChild("textarea")
  private textareaRef: ElementRef
  private textarea: any = null;
  ngAfterViewInit() {
    new ClipboardJS(".btn-clipboard")
    this.xi18n.init(this.xi18nRef.nativeElement);

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
        "|",
        {
          name: "file-management",
          className: "fas fa-upload",
          title: "File management",
          action: (editor) => {
            const settting = this.settingService.getSetting();
            this.dialog.open(
              DialogFilesComponent,
              {
                width: '80%',
                maxWidth: 800,
                data: {
                  book: settting.BookID,
                  chapter: settting.ChapterID,
                },
              },
            )
          },
        },
        {
          name: "file-upload",
          className: "fas fa-file-upload",
          title: "File upload",
          action: (editor) => {
            const settting = this.settingService.getSetting();
            this.dialog.open(
              DialogUploadComponent,
              {
                width: '80%',
                maxWidth: 800,
                data: {
                  book: settting.BookID,
                  chapter: settting.ChapterID,
                },
                disableClose: true,
              },
            )
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
    this.textarea.codemirror.on("refresh", (instance, from, to) => {
      // console.log(this.textarea.isFullscreenActive())
      this.settingService.updateFull(this.textarea.isFullscreenActive());
    });
    // console.log(this.textarea)
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
  onRouter(book: string, chapter: string) {
    if (this.textarea && this.textarea.value() != this.oldText) {
      this.toasterService.pop('error', '', this.xi18n.get("router"));
      return;
    }
    this.router.navigate(["/edit", book, chapter]);
  }
  private waitSave: boolean = false;
  private saveDocument(text: string) {
    if (text == this.oldText) {
      this.toasterService.pop('warning', '', this.xi18n.get("no.change"));
      return;
    }
    if (this.waitSave) {
      this.toasterService.pop('error', '', this.xi18n.get("save.wait"));
      return;
    }
    this.waitSave = false;
    const setting = this.settingService.getSetting();

    this.httpClient.post("/book/save", {
      ID: setting.BookID,
      Chapter: setting.ChapterID,
      Val: text,
    }).subscribe(
      () => {
        this.waitSave = false;
        this.oldText = text;
        this.toasterService.pop('success', '', this.xi18n.get("save.success"));
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
    if (!book || !book.Chapter || book.Chapter.length < 2) {
      return;
    }
    if (this.isRequest) {
      this.toasterService.pop('warning', '', this.xi18n.get("request.wait"));
      return;
    }
    const chapters = [];
    for (let i = 0; i < book.Chapter.length; i++) {
      chapters.push(book.Chapter[i].ID);
    }
    this.isRequest = true;
    this.httpClient.post("/Book/SortChapter", {
      ID: book.ID,
      Chapter: chapters,
    }).subscribe(
      () => {
        this.isRequest = false;
      },
      (e) => {
        this.isRequest = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    )
  }
  onChapterNew(book: Book) {
    if (!book) {
      return;
    }
    if (this.isRequest) {
      this.toasterService.pop('warning', '', this.xi18n.get("request.wait"));
      return;
    }

    const dialogRef = this.dialog.open(
      DialogChapterComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          title: this.xi18n.get("new.title"),
          id: "",
          name: "",
        },
      },
    )
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doNewChapter(book, result.id, result.name);
      }
    });
  }
  private doNewChapter(book: Book, id: string, name: string) {
    if (this.isRequest) {
      this.toasterService.pop('warning', '', this.xi18n.get("request.wait"));
      return;
    }

    this.isRequest = true;
    this.httpClient.post("/Book/NewChapter", {
      ID: book.ID,
      Chapter: id,
      Name: name,
    }).subscribe(
      () => {
        this.isRequest = false;
        this.toasterService.pop('success', '', 'Success');
        this.book.Chapter.push({
          ID: id,
          Name: name,
        })
      },
      (e) => {
        this.isRequest = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    )
  }
  onChapterEdit(evt, book: Book, chapterID: string, chapterName: string): boolean {
    evt.stopPropagation();
    if (!book || !book.Chapter || book.Chapter.length == 0) {
      return false;
    }

    if (!book) {
      return false;
    }
    if (this.isRequest) {
      this.toasterService.pop('warning', '', this.xi18n.get("request.wait"));
      return false;
    }

    const dialogRef = this.dialog.open(
      DialogChapterComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          title: this.xi18n.get("modify.title"),
          id: chapterID,
          name: chapterName,
        },
      },
    )
    dialogRef.afterClosed().subscribe(result => {
      if (result && (chapterID != result.id || chapterName != result.name)) {
        this.doModifyChapter(book, chapterID, result.id, result.name);
      }
    });
    return false;
  }
  doModifyChapter(book: Book, oldID: string, id: string, name: string) {
    if (this.isRequest) {
      this.toasterService.pop('warning', '', this.xi18n.get("request.wait"));
      return;
    }
    this.isRequest = true;
    this.httpClient.post("/Book/ModifyChapter", {
      ID: book.ID,
      OldChapter: oldID,
      Chapter: id,
      Name: name,
    }).subscribe(
      () => {
        this.isRequest = false;
        this.toasterService.pop('success', '', 'Success');
        if (id != oldID) {
          const setting = this.settingService.getSetting()
          if (setting.ChapterID == oldID) {
            setting.ChapterID = id;
          }
        }
        for (let i = 0; i < book.Chapter.length; i++) {
          const element = book.Chapter[i];
          if (element.ID == oldID) {
            element.ID = id;
            element.Name = name;
          }
        }
      },
      (e) => {
        this.isRequest = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    )
  }
  onChapterRemove(evt, book: Book, chapterID: string, chapterName: string) {
    evt.stopPropagation();
    if (!book || !book.Chapter || book.Chapter.length == 0) {
      return false;
    }
    if (this.isRequest) {
      this.toasterService.pop('warning', '', this.xi18n.get("request.wait"));
      return false;
    }

    const dialogRef = this.dialog.open(
      DialogSureComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          title: this.xi18n.get("sure.title"),
          text: this.xi18n.get("sure.text") + " - " + chapterName,
        },
      },
    )
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doRemove(book, chapterID);
      }
    });
    return false;
  }
  private doRemove(book: Book, chapterID: string) {
    if (!book || !book.Chapter || book.Chapter.length == 0) {
      return;
    }
    if (this.isRequest) {
      this.toasterService.pop('warning', '', this.xi18n.get("request.wait"));
      return;
    }

    this.isRequest = true;
    this.httpClient.post("/Book/RemoveChapter", {
      ID: book.ID,
      Chapter: chapterID,
    }).subscribe(
      () => {
        this.isRequest = false;
        for (let i = 0; i < book.Chapter.length; i++) {
          if (chapterID == book.Chapter[i].ID) {
            book.Chapter.splice(i, 1);
            break;
          }
        }
      },
      e => {
        this.isRequest = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    );
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
  saved(): boolean {
    if (this.textarea && this.textarea.value() != this.oldText) {
      this.toasterService.pop('error', '', this.xi18n.get("router"));
      return false;
    }
    return true;
  }
}
