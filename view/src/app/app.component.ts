import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { MatIconRegistry } from '@angular/material/icon';
import { I18nService } from './core/i18n/i18n.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  config: ToasterConfig =
    new ToasterConfig({
      positionClass: "toast-bottom-right"
    });
  constructor(private readonly matIconRegistry: MatIconRegistry,
    private readonly i18nService: I18nService,
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
    )
  }
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  ngAfterViewInit() {
    this.i18nService.init(this.xi18nRef.nativeElement)
  }
}
