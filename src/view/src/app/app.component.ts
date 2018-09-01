import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { ToasterConfig } from 'angular2-toaster';
import { CacheService } from './core/cache/cache.service';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../environments/environment';
declare const gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public config: ToasterConfig =
    new ToasterConfig({
      positionClass: "toast-bottom-right"
    });
  constructor(
    private cacheService: CacheService,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
  ) {
  }
  ngOnInit() {
    // 註冊圖標
    this.matIconRegistry.registerFontClassAlias(
      'fontawesome-fa', // 為此 Icon Font 定義一個 別名
      'fa' // 此 Icon Font 使用的 class 名稱
    ).registerFontClassAlias(
      'fontawesome-fab',
      'fab'
    ).registerFontClassAlias(
      'fontawesome-fal',
      'fal'
    ).registerFontClassAlias(
      'fontawesome-far',
      'far'
    ).registerFontClassAlias(
      'fontawesome-fas',
      'fas'
    );
    // 註冊 google analytics
    if (environment.gtag && gtag) {
      console.log("run google analytics", environment.gtag)
      gtag('config', environment.gtag);

      this.router.events.pipe(
        distinctUntilChanged(
          (previous: any, current: any) => {
            if (current instanceof NavigationEnd) {
              return previous.url === current.url;
            }
            return true;
          }
        )
      ).subscribe(
        (x: any) => {
          gtag('event', 'page_view', { 'page_path': x.url });
        }
      );
    }
  }
}
