import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { MatIconRegistry } from '@angular/material/icon';
import { I18nService } from './core/i18n/i18n.service';
import { ServerAPI } from './core/core/api';
import { HttpClient } from '@angular/common/http';
import { isString } from 'king-node/dist/core';
import { requireDynamic } from './core/core/utils';
import { Router, NavigationEnd } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
interface Google {
  analytics: string
  adSense: string
}
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
    private readonly httpClient: HttpClient,
    private readonly router: Router,
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

    ServerAPI.v1.google.get<Google>(this.httpClient).then((cnf) => {
      if (!cnf) {
        return
      }
      if (isString(cnf.analytics) && cnf.analytics.length > 0) {
        this._initAnalytics(cnf.analytics)
      }
      if (isString(cnf.adSense) && cnf.adSense.length > 0) {
        this._initAdSense(cnf.adSense)
      }
    })
  }
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  ngAfterViewInit() {
    this.i18nService.init(this.xi18nRef.nativeElement)
  }
  private _initAnalytics(id: string) {
    loadJS(`https://www.googletagmanager.com/gtag/js?id=${id}`, () => {
      let w: any = window
      w.dataLayer = w.dataLayer || []
      const gtag: any = function () { w.dataLayer.push(arguments) }
      w.gtag = gtag
      w.gtag('js', new Date())
      w.gtag('config', id)
      this.router.events.pipe(
        distinctUntilChanged(
          (previous: any, current: any) => {
            if (current instanceof NavigationEnd) {
              return previous.url === current.url
            }
            return true;
          }
        )
      ).subscribe(
        (x: any) => {
          gtag('event', 'page_view', { 'page_path': x.url })
        }
      )
    })
  }
  private _initAdSense(id: string) {
    loadJS('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', undefined, id)
  }
}
function loadJS(url: string, callback?: Function, id?: string) {
  const script: any = document.createElement('script')
  script.type = 'text/javascript'
  if (isString(id)) {
    if (script.setAttribute) {
      script.setAttribute('data-ad-client', id)
    } else {
      console.log('setAttribute not supported')
      return
    }
  }
  if (script.readyState) {//IE
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null
        if (callback) {
          callback()
        }
      }
    }
  } else {
    if (callback) {
      script.onload = callback
    }
  }
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}