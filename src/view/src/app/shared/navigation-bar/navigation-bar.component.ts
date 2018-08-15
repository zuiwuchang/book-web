import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../core/setting/setting.service';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  constructor(private settingService: SettingService) {
  }
  ngOnInit(){
    
  }
  openSource() {
    window.open("https://gitlab.com/king011/book-web", "_blank");
  }
  toggleChapter() {
    this.settingService.toggleChapter();
  }
  toggleHeader() {
    this.settingService.toggleHeader();
  }
  isChapter() {
    return this.settingService.getSetting().Chapter;
  }
  isHeader() {
    return this.settingService.getSetting().Header;
  }
}
