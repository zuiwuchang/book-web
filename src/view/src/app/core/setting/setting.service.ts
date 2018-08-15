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
  toggleChapter(){
    this.setting.Chapter = !this.setting.Chapter;
  }
  toggleHeader(){
    this.setting.Header = !this.setting.Header;
  }
}