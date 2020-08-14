import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/core/settings/settings.service';
import { Closed } from 'src/app/core/core/utils';
import { takeUntil } from 'rxjs/operators';
import { EditComponent as MarkdownEditComponent } from '../../markdown/edit/edit.component';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

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
  @ViewChild(MarkdownEditComponent)
  private child: MarkdownEditComponent
  saved(): boolean {
    if (!this.child) {
      return true;
    }
    return this.child.saved()
  }
}
