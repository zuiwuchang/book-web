import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService, PageView, OpenedBook } from '../../core/settings/settings.service';
import { SessionService, Session } from '../../core/session/session.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Closed } from 'src/app/core/core/utils';

@Component({
  selector: 'shared-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnDestroy {

  constructor(
    private readonly settingsService: SettingsService,
    private readonly sessionService: SessionService,
    private readonly matDialog: MatDialog,
  ) { }
  private closed_ = new Closed()
  fullscreen = false
  ready = false
  session: Session
  chapter = false
  header = false
  opened: OpenedBook
  private page_ = PageView.Nil

  ngOnInit(): void {
    this.sessionService.ready.then((data) => {
      this.ready = data
      this.sessionService.observable.pipe(
        takeUntil(this.closed_.observable),
      ).subscribe((data) => {
        this.session = data
      })
    })
    this.settingsService.fullscreenObservable.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe((ok) => {
      this.fullscreen = ok
    })
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
    this.settingsService.pageObservable.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe((page) => {
      this.page_ = page
    })
    this.settingsService.openedObservable.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe((opened) => {
      this.opened = opened
    })
  }
  ngOnDestroy() {
    this.closed_.close()
  }
  toggleChapter() {
    this.settingsService.toggleChapter()
  }
  toggleHeader() {
    this.settingsService.toggleHeader()
  }
  onClickLogin() {
    this.matDialog.open(LoginComponent)
  }
  onLogout() {
    this.sessionService.logout().catch((e) => {
      console.log(e)
    })
  }
  isPageView(): boolean {
    return this.page_ == PageView.View
  }
  isPageEdit(): boolean {
    return this.page_ == PageView.Edit
  }
}
