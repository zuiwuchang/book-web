import { Component  } from '@angular/core';
import {SettingService} from './core/setting/setting.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'app';
  constructor(private settingService:SettingService) {
  }
  openSource() {
    window.open("https://gitlab.com/king011/book-web", "_blank");
  }
  toggleChapter(){
    this.settingService.toggleChapter();
  }
  toggleHeader(){
    this.settingService.toggleHeader();
  }
  isChapter() {
    return this.settingService.getSetting().Chapter;
  }
  isHeader() {
    return this.settingService.getSetting().Header;
  }
}
