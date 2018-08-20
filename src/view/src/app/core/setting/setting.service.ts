import { Injectable } from '@angular/core';
import { Setting } from './setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private setting: Setting = new Setting()
  constructor() {
    const isChapter = this.getKey("isChapter");
    if (isChapter == undefined) {
      if (window.screen.width < 800) {
        this.setting.Chapter = false;
      } else {
        this.setting.Chapter = true;
      }
    } else if (isChapter == "false") {
      this.setting.Chapter = false;
    } else {
      this.setting.Chapter = true;
    }
    const isHeader = this.getKey("isHeader");
    if (isHeader == undefined) {
      if (window.screen.width < 600) {
        this.setting.Header = false;
      } else {
        this.setting.Header = true;
      }
    } else if (isHeader == "false") {
      this.setting.Header = false;
    } else {
      this.setting.Header = true;
    }
    console.log(window.screen.width,this.setting.Header)
  }
  private getKey(key: string): string {
    if (typeof (Storage) == "undefined") {
      console.log("not support storage")
      return undefined;
    }
    return localStorage.getItem(key)
  }
  private setKey(key: string, val: string) {
    if (typeof (Storage) == "undefined") {
      console.log("not support storage")
      return;
    }
    localStorage.setItem(key, val);
  }
  // 返回 設置
  getSetting(): Setting {
    return this.setting;
  }
  toggleChapter() {
    this.setting.Chapter = !this.setting.Chapter;
    if (this.setting.Chapter) {
      this.setKey("isChapter", "true");
    } else {
      this.setKey("isChapter", "false");
    }
  }
  toggleHeader() {
    this.setting.Header = !this.setting.Header;
    if (this.setting.Header) {
      this.setKey("isHeader", "true");
    } else {
      this.setKey("isHeader", "false");
    }
  }
  updatePage(page: number, book?: string, chapter?: string) {
    this.setting.Page = page;
    this.setting.BookID = book;
    this.setting.ChapterID = chapter;
  }
  updateFull(yes: boolean) {
    if (this.setting.Full != yes) {
      this.setting.Full = yes;
    }
  }
}
