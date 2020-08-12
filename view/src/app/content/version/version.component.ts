import { Component, OnInit, VERSION, OnDestroy } from '@angular/core';
import { ServerAPI } from 'src/app/core/core/api';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { Title } from '@angular/platform-browser';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { isNumber } from 'king-node/dist/core';
import * as moment from 'moment';
import { unix, Moment, now } from 'moment';
import { interval } from 'rxjs';
import { Closed } from 'src/app/core/core/utils';
import { takeUntil } from 'rxjs/operators';
interface Version {
  platform: string
  tag: string
  commit: string
  date: string
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
  started: any
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
        moment.unix
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
        const duration = moment.duration(moment().diff(this.startAt))
        this.started = `${Math.floor(duration.asDays())} day ${Math.floor(duration.asHours()) % 24} hours ${Math.floor(duration.asMinutes()) % 60} minutes ${Math.floor(duration.asSeconds()) % 60} seconds`
      }
    })
  }
  ngOnDestroy() {
    this.closed_.close()
  }
}
