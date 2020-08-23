import { Component, OnInit, Input } from '@angular/core';
import { Ads, chechAds } from 'src/app/core/ads/ads.service';

@Component({
  selector: 'shared-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  private ads_: Ads
  ok = false
  @Input()
  set ads(v: Ads) {
    this.ads_ = v
    this.ok = chechAds(v)
  }
  get ads(): Ads {
    return this.ads_
  }
  @Input()
  display: string
  @Input()
  adFormat: string
  @Input()
  adtest: string
  @Input()
  className: string
  @Input()
  fullWidthResponsive: boolean
  @Input()
  layout: string
}
