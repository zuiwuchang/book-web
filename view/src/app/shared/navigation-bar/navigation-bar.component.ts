import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../core/settings/settings.service';
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
    public readonly settingsService: SettingsService,
    public readonly sessionService: SessionService,
    public readonly matDialog: MatDialog,
  ) { }
  private closed_ = new Closed()
  fullscreen = false
  ready = false
  session: Session
  chapter = false
  header = false

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
}
