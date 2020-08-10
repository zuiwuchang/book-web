import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../core/settings/settings.service';
import { SessionService, Session } from '../../core/session/session.service';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'shared-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnDestroy {

  constructor(
    private readonly settingsService: SettingsService,
    private readonly sessionService: SessionService,
  ) { }
  private closed_ = new BehaviorSubject<boolean>(false)
  fullscreen = false
  ready = false
  session: Session

  ngOnInit(): void {
    this.fullscreen = this.settingsService.fullscreen
    this.settingsService.fullscreenObservable.pipe(
      takeUntil(this.closed_),
    ).subscribe((ok) => {
      this.fullscreen = ok
    })
    this.sessionService.ready.then((data) => {
      this.ready = data

      this.sessionService.observable.pipe(
        takeUntil(this.closed_),
      ).subscribe((data) => {
        this.session = data
      })
    })
  }
  ngOnDestroy() {
    this.closed_.next(true)
  }
  toggleChapter() {
    this.settingsService.toggleChapter()
  }
  toggleHeader() {
    this.settingsService.toggleHeader()
  }
  isChapter() {
    return this.settingsService.chapter
  }
  isHeader() {
    return this.settingsService.header
  }
}
