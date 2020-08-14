import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { Closed } from 'src/app/core/core/utils';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { Title } from '@angular/platform-browser';
import { Loader } from '../loader';
import { MarkdownEditComponent } from '../markdown-edit/markdown-edit.component';
@Component({
  selector: 'markdown-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

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
      loader.load(this.httpClient, true).then((title) => {
        if (this.loader != loader) {
          return
        }
        this.title.setTitle(title)
        this.settingsService.nextEditPage()
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
    this.settingsService.closeEditPage()
  }
  @ViewChild(MarkdownEditComponent)
  private child: MarkdownEditComponent
  saved(): boolean {
    if (!this.child) {
      return true;
    }
    return this.child.saved()
  }
}
