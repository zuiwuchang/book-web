import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingService } from '../../core/setting/setting.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';

import { SessionService } from '../../core/session/session.service';
import { Session } from '../../core/session/session';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  // 登入 用戶
  session: Session = null;
  private subscription: Subscription = null;
  constructor(private settingService: SettingService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {
  }
  ngOnInit() {
    // 訂閱 用戶 狀態
    this.subscription = this.sessionService.SubscribeSession(
      (v: Session) => {
        if (this.session == v) {
          return
        }
        this.session = v;
      }
    )
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
  onLogin() {
    this.dialog.open(LoginComponent, {
      width: '80%',
      maxWidth: 800,
      //disableClose: true,
    });
  }
  onLogout() {
    if (this.session == null) {
      console.log("session == null , ignore onLogout");
      return;
    }
    this.sessionService.Logout({
      error(e) {
        console.log(e)
      },
    });
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
  isPageView(){
    return this.session && (this.settingService.getSetting().Page == 1);
  }
  isPageEdit(){
    return this.session && (this.settingService.getSetting().Page == 2);
  }
  getBookID(){
    return this.settingService.getSetting().BookID;
  }
  getChapterID(){
    return this.settingService.getSetting().ChapterID;
  }
}
