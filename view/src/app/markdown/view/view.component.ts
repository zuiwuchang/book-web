import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { Closed } from 'src/app/core/core/utils';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { Title } from '@angular/platform-browser';
import { Loader } from '../loader';

@Component({
  selector: 'markdown-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  constructor(private httpClient: HttpClient,
    private readonly i18nService: I18nService,
    private readonly title: Title,
    private readonly settingsService: SettingsService,
  ) { }
  error: any
  loader: Loader
  loading = false
  private closed_ = new Closed()
  ngOnInit(): void {
    this.settingsService.openedObservable.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe((opened) => {
      this.title.setTitle(this.i18nService.get('Loading'))
      const loader = new Loader(opened)
      this.loader = loader
      this.loading = true
      loader.load(this.httpClient).then((title) => {
        if (this.loader != loader) {
          return
        }
        this.title.setTitle(title)
        this.settingsService.nextViewPage()
        this.loading = false
      }, (e) => {
        if (this.loader != loader) {
          return
        }
        this.loader = null
        this.title.setTitle(this.i18nService.get('Error'))
        this.error = e
        this.loading = false
      })
    })
  }
  ngOnDestroy() {
    this.closed_.close()
    this.settingsService.closeViewPage()
  }
}
