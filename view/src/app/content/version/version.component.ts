import { Component, OnInit, VERSION, OnDestroy } from '@angular/core';
import { ServerAPI } from 'src/app/core/core/api';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { Title } from '@angular/platform-browser';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { isNumber } from 'king-node/dist/core';
import { unix, duration, now, Moment } from 'moment';
import { interval } from 'rxjs';
import { Closed } from 'src/app/core/core/utils';
import { takeUntil } from 'rxjs/operators';
interface Version {
  platform: string
  version: string
  goMaxprocs: number
  numCgoCall: number
  numGoroutine: number
  startAt: any
}
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit, OnDestroy {

  VERSION = VERSION
  version: Version
  startAt: Moment
  started: string
  private closed_ = new Closed()
  constructor(private httpClient: HttpClient,
    private toasterService: ToasterService,
    private readonly i18nService: I18nService,
    private readonly title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle(this.i18nService.get('Version'))
    ServerAPI.v1.version.get<Version>(this.httpClient).then((data) => {
      this.version = data
      if (isNumber(data.startAt)) {
        this.startAt = unix(data.startAt)
      }
    }, (e) => {
      this.toasterService.pop('error',
        undefined,
        e,
      )
    })

    interval(1000).pipe(
      takeUntil(this.closed_.observable),
    ).subscribe(() => {
      if (this.startAt) {
        const d = duration(unix(now() / 1000).diff(this.startAt))
        this.started = `${Math.floor(d.asDays())} day ${Math.floor(d.asHours()) % 24} hours ${Math.floor(d.asMinutes()) % 60} minutes ${Math.floor(d.asSeconds()) % 60} seconds`
      }
    })
  }
  ngOnDestroy() {
    this.closed_.close()
  }
}
