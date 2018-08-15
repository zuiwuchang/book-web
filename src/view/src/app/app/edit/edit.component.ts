import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs';
import { SettingService } from '../../core/setting/setting.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  book: string = '';
  chapter: string = '';
  private subscription: Subscription = null;
  constructor(private activatedRoute: ActivatedRoute, private settingService: SettingService) {
  }
  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (p) => {
        if (!p) {
          return;
        }
        this.book = p.book;
        this.chapter = p.chapter;

        this.settingService.updatePage(2, this.book, this.chapter);
      },
      (e) => {
        console.warn(e);
      }
    )
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.settingService.updatePage(0);
  }

}
