import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { requireDynamic } from 'src/app/core/core/utils';
declare const requirejs: any
@Component({
  selector: 'shared-adsense',
  // templateUrl: './adsense.component.html',
  // styleUrls: ['./adsense.component.scss'],
  template: `
  <ins
    #ins
  >
  </ins>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdsenseComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(@Inject(PLATFORM_ID) private platform: any,) { }
  /** adsense account ca-pub-XXXXXXXXXXXXXXXX */
  @Input() adClient!: string;
  @ViewChild('ins', { read: ElementRef, static: true }) ins!: ElementRef;
  ngOnInit(): void {
    const iframe = this.ins.nativeElement.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.src = 'about:blank';
      iframe.remove();
    }
  }
  ngOnDestroy(): void {
    const iframe = this.ins.nativeElement.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.src = 'about:blank';
      iframe.remove();
    }
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform)) {
      this.push();
    }
  }
  resetWindow(obj: any) {
    obj.google_js_reporting_queue = null;
    obj.google_srt = null;
    obj.google_ad_modifications = null;
    obj.google_logging_queue = null;
    obj.ggeac = null;
    obj.google_measure_js_timing = null;
    obj.google_trust_token_redemption_status = null;
    obj.google_reactive_ads_global_state = null;
    obj._gfp_a_ = null;
    obj.adsbygoogle = null;
    obj.google_sa_queue = null;
    obj.google_sl_win = null;
    obj.google_process_slots = null;
    obj.google_ama_state = null;
    obj.google_spfd = null;
    obj.google_sv_map = null;
    const items = new Array<string>()
    for (const key in obj) {
      const v = key.toLowerCase()
      if (v.startsWith('goog')) {
        items.push(key)
      }
    }
    items.forEach((k) => {
      obj[k] = null
    })
  }
  push(): void {
    const p: Record<string, string | boolean> = {};

    p.google_ad_client = this.adClient;
    p.enable_page_level_ads = true;

    if (window) {
      //console.log((window as any).adsbygoogle);
      // try {
      //   console.log(`push`, p);
      //   // tslint:disable-next-line:no-any
      //   ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(p);
      // } catch (e) {
      //   // pass
      //   console.log(`push error : `, e)
      // }
      this.resetWindow(window);
      requirejs.undef('adsbygoogle');
      requireDynamic('adsbygoogle').then(() => {
        try {
          console.log(window)
          console.log(`push`, p);
          // tslint:disable-next-line:no-any
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(p);
        } catch (e) {
          // pass
          console.log(`push error : `, e)
        }
      })
    }
  }
}
