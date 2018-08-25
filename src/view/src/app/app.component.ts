import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { ToasterConfig } from 'angular2-toaster';
import { CacheService } from './core/cache/cache.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public config: ToasterConfig =
    new ToasterConfig({
      positionClass: "toast-bottom-right"
    });
  constructor(
    private cacheService: CacheService,
    private matIconRegistry: MatIconRegistry,
  ) {
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
  }
}
