import { Injectable } from '@angular/core';
import { Setting } from './setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private setting: Setting = new Setting()
  constructor() { }
  // 返回 設置
  getSetting(): Setting {
    return this.setting;
  }
  toggleChapter() {
    this.setting.Chapter = !this.setting.Chapter;
  }
  toggleHeader() {
    this.setting.Header = !this.setting.Header;
  }
  updatePage(page: number, book?: string, chapter?: string) {
    this.setting.Page = page;
    this.setting.BookID = book;
    this.setting.ChapterID = chapter;
  }
  updateFull(yes: boolean) {
    if(this.setting.Full != yes){
      this.setting.Full = yes;
    }
  }
}
