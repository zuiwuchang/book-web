import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class OpenedBook {
  constructor(public readonly book: string, public readonly chapter: string) {
  }
}
export enum PageView {
  Nil,
  View,
  Edit,
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private chapter_ = new BehaviorSubject<boolean>(false)
  private header_ = new BehaviorSubject<boolean>(false)
  private fullscreen_ = new BehaviorSubject<boolean>(false)
  private opened_ = new BehaviorSubject<OpenedBook>(null)
  private page_ = new BehaviorSubject<PageView>(PageView.Nil)
  constructor() {
    const isChapter = this._getKey("isChapter")
    if (isChapter == undefined) {
      if (window.screen.width < 800) {
        this.chapter_.next(false)
      } else {
        this.chapter_.next(true)
      }
    } else if (isChapter == "false") {
      this.chapter_.next(false)
    } else {
      this.chapter_.next(true)
    }
    const isHeader = this._getKey("isHeader")
    if (isHeader == undefined) {
      if (window.screen.width < 600) {
        this.header_.next(false)
      } else {
        this.header_.next(true)
      }
    } else if (isHeader == "false") {
      this.header_.next(false)
    } else {
      this.header_.next(true)
    }
  }
  private _getKey(key: string): string {
    if (!localStorage) {
      console.log("not support localStorage")
      return undefined
    }
    return localStorage.getItem(key)
  }
  private _setKey(key: string, val: string) {
    if (!localStorage) {
      console.log("not support storage")
      return
    }
    localStorage.setItem(key, val)
  }
  /**
   * 切換 章節 顯示狀態
   */
  toggleChapter() {
    const ok = this.chapter_.value
    if (ok) {
      this.chapter_.next(false)
      this._setKey("isChapter", "false")
    } else {
      this.chapter_.next(true)
      this._setKey("isChapter", "true")
    }
  }
  /**
   * 切換 段落 顯示狀態
   */
  toggleHeader() {
    const ok = this.header_.value
    if (ok) {
      this.header_.next(false)
      this._setKey("isHeader", "false")
    } else {
      this.header_.next(true)
      this._setKey("isHeader", "true")
    }
  }
  get chapter(): boolean {
    return this.header_.value
  }
  get header(): boolean {
    return this.header_.value
  }
  /**
   * 設置 是否全屏顯示
   */
  set fullscreen(yes: boolean) {
    let ok: boolean
    if (yes) {
      ok = true
    } else {
      ok = false
    }
    if (this.fullscreen_.value == ok) {
      return
    }
    this.fullscreen_.next(ok)
  }
  /**
   * 返回 是否全屏顯示
   */
  get fullscreen(): boolean {
    return this.fullscreen_.value
  }
  /**
   * 返回 是否全屏顯示 可訂閱對象
   */
  get fullscreenObservable(): Observable<boolean> {
    return this.fullscreen_
  }
  get chapterObservable(): Observable<boolean> {
    return this.chapter_
  }
  get headerObservable(): Observable<boolean> {
    return this.header_
  }

  /**
   * 返回 已打開的書
   */
  get opened(): OpenedBook {
    return this.opened_.value
  }
  get openedObservable(): Observable<OpenedBook> {
    return this.opened_
  }
  open(book: string, chapter: string) {
    const opened = this.opened_.value
    if (opened && opened.book == book && opened.chapter == chapter) {
      return
    }
    this.opened_.next(new OpenedBook(book, chapter))
  }
  close() {
    if (this.opened_.value) {
      this.opened_.next(null)
    }
  }
  get pageObservable(): Observable<PageView> {
    return this.page_
  }
  nextViewPage() {
    if (PageView.View != this.page_.value) {
      this.page_.next(PageView.View)
    }
  }
  nextEditPage() {
    if (PageView.Edit != this.page_.value) {
      this.page_.next(PageView.Edit)
    }
  }
  closeViewPage() {
    if (PageView.View == this.page_.value) {
      this.page_.next(PageView.Nil)
    }
  }
  closeEditPage() {
    if (PageView.Edit == this.page_.value) {
      this.page_.next(PageView.Nil)
    }
  }
}
