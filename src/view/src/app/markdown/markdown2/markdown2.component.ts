import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
import { Strings } from '../strings';
import * as $ from 'jquery';
declare var MathJax;
class PreviewCache {
  val: string;
  preview: SafeHtml;
}
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
export class Markdown2Component implements OnInit, AfterViewInit, OnDestroy {
  private previewCache: PreviewCache = new PreviewCache();
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
      //console.log(this.textarea.render)
      if (this.textarea.isPreviewActive()) {
        this.textarea.togglePreview();
        this.textarea.togglePreview();
      }
    }
    this.initNavigate(this.book, this.settingService.getSetting().ChapterID);
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
    if (this.elementRef.nativeElement) {
      $(this.elementRef.nativeElement).undelegate(".ng-router-a", "click");
    }
  }
  private clipboard: any = null;
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  @ViewChild("textarea")
  private textareaRef: ElementRef
  private textarea: any = null;
  ngAfterViewInit() {
    this.clipboard = new ClipboardJS(this.btnClipboard.nativeElement).on('success', () => {
      this.toasterService.pop('info', '', this.xi18n.get("copyied"));
    }).on('error', (evt) => {
      console.error('Action:', evt.action);
      console.error('Trigger:', evt.trigger);
    });
    this.xi18n.init(this.xi18nRef.nativeElement);

    this.textarea = new SimpleMDE({
      // 禁用 圖標下載 已經手動配置
      autoDownloadFontAwesome: false,
      // 指定 document 元素
      element: this.textareaRef.nativeElement,
      // 自定義 預覽 產生 html
      previewRender: (plainText, preview) => {
        // 和緩存匹配 直接返回
        if (this.previewCache.val == plainText) {
          this.update = true;
          return this.previewCache.preview;
        }
        this.markdown = new Markdown(null,
          this.settingService.getSetting().BookID,
          this.settingService.getSetting().ChapterID,
          plainText);
        this.previewCache.preview = this.markdown.HTML;
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
          title: "Save (Ctrl-S)",
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
        "|",
        {
          name: "markdown escape",
          className: "fas fa-angle-double-right",
          title: "Markdown Escape (Ctrl-M)",
          action: (editor) => {
            const cm = editor.codemirror;
            let text = cm.getSelection();
            text = Strings.escape(text);
            cm.replaceSelection(text, "around");
          },
        },
        {
          name: "markdown unescape",
          className: "fas fa-angle-double-left",
          title: "Markdown Unescape (Ctrl-Alt-M)",
          action: (editor) => {
            const cm = editor.codemirror;
            let text = cm.getSelection();
            text = Strings.unescape(text);
            cm.replaceSelection(text, "around");
          },
        },
        "|", "unordered-list", "ordered-list",
        "|", "link", {
          name: "image",
          className: "fa fa-image",
          title: "Insert Image",
          action: SimpleMDE.drawImage,
        }, "table",
        "|", "preview", "side-by-side", "fullscreen"
      ],
    });
    // 爲 編輯器 增加快捷鍵
    const codemirror = this.textarea.codemirror;
    const keys = codemirror.getOption("extraKeys");
    // 保存
    keys["Ctrl-S"] = () => {
      this.saveDocument(this.textarea.value());
    };
    keys["Ctrl-Enter"] = (cm) => {
      const doc = cm.getDoc();
      const cursor = doc.getCursor(); // gets the line number in the cursor position
      const line = doc.getLine(cursor.line); // get the line contents
      const pos = { // create a new object to avoid mutation of the original selection
        line: cursor.line,
        ch: line.length // set the character position to the end of the line
      }
      doc.replaceRange('\n', pos);
      doc.setCursor({
        line: cursor.line + 1,
        ch: 0,
      });
    };
    keys["Ctrl-M"] = (cm) => {
      let text = cm.getSelection();
      text = Strings.escape(text);
      cm.replaceSelection(text, "around");
    };
    keys["Ctrl-Alt-M"] = (cm) => {
      let text = cm.getSelection();
      text = Strings.unescape(text);
      cm.replaceSelection(text, "around");
    };
    codemirror.setOption("extraKeys", keys);

    this.textarea.value(this.oldText);
    // 監控 全屏 狀態 通知 angular 服務 以便 隱藏阿一些 頂層元素
    this.textarea.codemirror.on("refresh", (instance, from, to) => {
      // console.log(this.textarea.isFullscreenActive())
      this.settingService.updateFull(this.textarea.isFullscreenActive());
    });

    $(this.elementRef.nativeElement).delegate(".ng-router-a", "click", (evt) => {
      const url = $(evt.target).attr("href");
      this.router.navigate([url]);
      return false;
    });
  }
  @ViewChild("view")
  private elementRef: ElementRef
  @ViewChild("btnClipboard")
  private btnClipboard: ElementRef
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
      this.btnClipboard.nativeElement.setAttribute("data-clipboard-text", ele.innerText.replace(/ /g," "))
      this.btnClipboard.nativeElement.click();
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
    this.waitSave = true;
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
          isNew: true,
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
      (chapterID: string) => {
        this.isRequest = false;
        this.toasterService.pop('success', '', 'Success');
        this.book.Chapter.push({
          ID: chapterID,
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
