import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Book, Chapter } from 'src/app/core/protocol';
import { SettingsService, OpenedBook } from 'src/app/core/settings/settings.service';
import { Closed, requireDynamic } from 'src/app/core/core/utils';
import { takeUntil } from 'rxjs/operators';
import { Markdown } from '../markdown';
import { Loader } from '../loader';
import { MathJaxQueue } from '../mathJax';
import { HighlightJsService } from 'angular2-highlight-js';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { SafeHtml } from '@angular/platform-browser';
import { Strings } from '../strings';
import { ServerAPI } from 'src/app/core/core/api';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewChapterComponent } from '../dialog/new-chapter/new-chapter.component';
import { EditChapterComponent } from '../dialog/edit-chapter/edit-chapter.component';
import { RemoveChapterComponent } from '../dialog/remove-chapter/remove-chapter.component';
import { FileUploadComponent } from '../dialog/file-upload/file-upload.component';
import { FileManagementComponent } from '../dialog/file-management/file-management.component';
declare const $: any
class Navigate {
  constructor(public book: string, public chapter: string, public name: string) {
  }
}
class PreviewCache {
  val: string
  preview: SafeHtml
}
@Component({
  selector: 'markdown-markdown-edit',
  templateUrl: './markdown-edit.component.html',
  styleUrls: ['./markdown-edit.component.scss']
})
export class MarkdownEditComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  constructor(private readonly settingsService: SettingsService,
    private readonly i18nService: I18nService,
    private readonly highlightJsService: HighlightJsService,
    private readonly toasterService: ToasterService,
    private readonly router: Router,
    private readonly httpClient: HttpClient,
    private readonly matDialog: MatDialog,
  ) { }
  opened: OpenedBook
  @Input()
  set loader(l: Loader) {
    const opened = l.opened
    const book = l.book
    this.book = book
    this._initNavigate(book, opened.chapter)
    this.update_ = true
    this.oldText = l.text
    this.opened = opened
  }
  private closed_ = new Closed()
  private previewCache_ = new PreviewCache()
  private oldText = ""
  book: Book
  chapter = false
  header = false
  title: string
  markdown: Markdown
  private update_ = false
  previous: Navigate
  next: Navigate
  private clipboard: any
  fullscreen = false
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
    this.settingsService.fullscreenObservable.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe((ok) => {
      this.fullscreen = ok
    })
    timer(1000, 1000).pipe(
      takeUntil(this.closed_.observable),
    ).subscribe(() => {
      if (!this.textarea) {
        return
      }
      this.settingsService.isPreviewActive = this.textarea.isPreviewActive()
    })
  }
  ngOnDestroy() {
    this.closed_.close()
    this.fullscreen = false
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
  @ViewChild("textarea")
  private textareaRef: ElementRef
  private textarea: any = null
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
    })
    this._initSimpleMDE()
  }
  private async _initSimpleMDE() {
    const showdown = await requireDynamic('showdown')
    const SimpleMDE = await requireDynamic('simplemde')
    this.textarea = new SimpleMDE({
      // 禁用 圖標下載 已經手動配置
      autoDownloadFontAwesome: false,
      // 指定 document 元素
      element: this.textareaRef.nativeElement,
      // 自定義 預覽 產生 html
      previewRender: (plainText: string, preview: any) => {
        // 和緩存匹配 直接返回
        if (this.previewCache_.val == plainText) {
          this.update_ = true
          return this.previewCache_.preview
        }
        const opened = this.opened
        this.markdown = new Markdown(showdown,
          null,
          opened.book,
          opened.chapter,
          plainText)
        this.previewCache_.preview = this.markdown.HTML
        this.update_ = true
        return this.markdown.HTML
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
          action: (editor: any) => {
            this.saveDocument(editor.value());
          },
        },
        "|",
        {
          name: "file-management",
          className: "fas fa-upload",
          title: "File management",
          action: (editor: any) => {
            this.matDialog.open(FileManagementComponent, {
              width: '80%',
              maxWidth: 800,
              data: this.opened,
              disableClose: true,
            })
          },
        },
        {
          name: "file-upload",
          className: "fas fa-file-upload",
          title: "File upload",
          action: (editor: any) => {
            this.matDialog.open(FileUploadComponent, {
              width: '80%',
              maxWidth: 800,
              data: this.opened,
              disableClose: true,
            })
          },
        },
        "|", "bold", "italic",
        "|", "code", "quote",
        "|",
        {
          name: "markdown escape",
          className: "fas fa-angle-double-right",
          title: "Markdown Escape (Ctrl-M)",
          action: (editor: any) => {
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
          action: (editor: any) => {
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
    keys["Ctrl-Enter"] = (cm: any) => {
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
    keys["Ctrl-M"] = (cm: any) => {
      let text = cm.getSelection();
      text = Strings.escape(text);
      cm.replaceSelection(text, "around");
    };
    keys["Ctrl-Alt-M"] = (cm: any) => {
      let text = cm.getSelection();
      text = Strings.unescape(text);
      cm.replaceSelection(text, "around");
    };
    codemirror.setOption("extraKeys", keys);

    this.textarea.value(this.oldText);
    // 監控 全屏 狀態 通知 angular 服務 以便 隱藏阿一些 頂層元素
    this.textarea.codemirror.on("refresh", (instance: any, from: any, to: any) => {
      this.settingsService.fullscreen = this.textarea.isFullscreenActive()
    })

    if (this.settingsService.isPreviewActive) {
      this.textarea.togglePreview()
    }
    this.readyEdit = true
  }
  readyEdit = false
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
  saved(): boolean {
    if (this.textarea && this.textarea.value() != this.oldText) {
      this.toasterService.pop('error', undefined, this.i18nService.get('not saved'));
      return false
    }
    return true
  }
  private waitSave: boolean = false;
  private saveDocument(text: string) {
    if (text == this.oldText) {
      this.toasterService.pop('warning', '', this.i18nService.get("not changed"))
      return
    }
    if (this.waitSave) {
      this.toasterService.pop('error', '', this.i18nService.get("waiting save"))
      return
    }
    this.waitSave = true
    const opened = this.opened
    ServerAPI.v1.text.put(this.httpClient, {
      book: opened.book,
      chapter: opened.chapter,
      text: text,
    }).then(() => {
      this.oldText = text;
      this.toasterService.pop('success', undefined, this.i18nService.get("save success"))
    }, (e) => {
      this.toasterService.pop('error', undefined, e)
    }).finally(() => {
      this.waitSave = false
    })
  }
  disabled = false
  onChapterSort(book: Book) {
    if (this.disabled) {
      return
    }
    if (!book || !book.chapter || book.chapter.length < 2) {
      return
    }
    const chapters = []
    for (let i = 0; i < book.chapter.length; i++) {
      chapters.push(book.chapter[i].id)
    }
    this.disabled = true
    ServerAPI.v1.chapters.putOne(this.httpClient, 'sort', {
      book: book.id,
      chapters: chapters,
    }).then(() => {
      this.toasterService.pop('success', undefined, this.i18nService.get("save sort success"))
    }, (e) => {
      this.toasterService.pop('error', undefined, e)
    }).finally(() => {
      this.disabled = false
    })
  }
  async onChapterNew() {
    if (this.disabled) {
      return
    }
    const chapter = await this.matDialog.open(NewChapterComponent,
      {
        width: '80%',
        maxWidth: 800,
      },
    ).afterClosed().toPromise<Chapter>()
    if (!chapter) {
      return
    }
    this.disabled = true
    try {
      chapter.id = await ServerAPI.v1.chapters.post(this.httpClient, {
        book: this.opened.book,
        id: chapter.id,
        name: chapter.name
      })
      if (!this.book.chapter) {
        this.book.chapter = new Array<Chapter>()
      }
      this.book.chapter.push(chapter)
      this.toasterService.pop('success', undefined, this.i18nService.get("new chapter success"))
    } catch (e) {
      this.toasterService.pop('error', undefined, e)
    } finally {
      this.disabled = false
    }
  }
  onChapterEdit(evt: Event, book: Book, chapter: Chapter): boolean {
    evt.stopPropagation();
    if (!book || !book.chapter || book.chapter.length == 0) {
      return false
    }
    if (this.disabled) {
      return false
    }

    this.matDialog.open(EditChapterComponent, {
      width: '80%',
      maxWidth: 800,
      data: {
        id: chapter.id,
        name: chapter.name,
      },
    },
    ).afterClosed().toPromise<Chapter>().then((val) => {
      if (!val) {
        return
      }
      if (val.id == chapter.id && val.name == chapter.name) {
        return
      }
      this.disabled = true
      ServerAPI.v1.chapters.put(this.httpClient, {
        book: book.id,
        chapter: chapter.id,
        id: val.id,
        name: val.name,
      }).then(() => {
        chapter.id = val.id
        chapter.name = val.name
        this.toasterService.pop('success', undefined, this.i18nService.get("save chapter success"))
      }, (e) => {
        this.toasterService.pop('error', undefined, e)
      }).finally(() => {
        this.disabled = false
      })
    })
    return false
  }
  onChapterRemove(evt: Event, book: Book, chapter: Chapter) {
    evt.stopPropagation();
    if (!book || !book.chapter || book.chapter.length == 0) {
      return false
    }
    if (this.disabled) {
      return false
    }

    this.matDialog.open(RemoveChapterComponent, {
      width: '80%',
      maxWidth: 800,
      data: chapter,
    }).afterClosed().toPromise<boolean>().then((ok) => {
      if (!ok) {
        return
      }
      this.disabled = true
      ServerAPI.v1.chapters.delete(this.httpClient, {
        params: {
          book: book.id,
          chapter: chapter.id,
        },
      }).then(() => {
        this.toasterService.pop('success', undefined, this.i18nService.get("remove chapter success"))
        const index = book.chapter.indexOf(chapter)
        if (index != -1) {
          book.chapter.splice(index, 1)
        }
      }, (e) => {
        this.toasterService.pop('error', undefined, e)
      }).finally(() => {
        this.disabled = false
      })
    })
    return false
  }
}

