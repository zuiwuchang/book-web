import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Closed } from 'src/app/core/core/utils';
import { SettingsService } from '../../core/settings/settings.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly settingsService: SettingsService,
  ) { }
  private closed_ = new Closed()
  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      takeUntil(this.closed_.observable),
    ).subscribe(
      (p) => {
        if (!p) {
          return
        }
        const book = p.book
        const chapter = p.chapter

        this.settingsService.open(book, chapter)
      },
      (e) => {
        console.warn(e)
      }
    )
  }
  ngOnDestroy() {
    this.closed_.close()
  }
}
