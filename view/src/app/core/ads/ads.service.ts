import { Injectable } from '@angular/core';
import { Completer } from 'king-node/dist/async/completer';
import { isString } from 'king-node/dist/core';
export interface AdSense {
  auto?: string
  top?: Ads
  text?: Ads
  bottom?: Ads
}
export interface Ads {
  id: string
  slot: string
  frequency?: number
}
export function chechAds(ads: Ads): boolean {
  return ads && isString(ads.id) && isString(ads.slot) && ads.id.length > 0 && ads.slot.length > 0
}
@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private ready_ = new Completer<AdSense>()
  constructor() { }
  get ready(): Promise<AdSense> {
    return this.ready_.promise
  }
  resolve(adSense: AdSense) {
    this.ready_.resolve(adSense)
  }
}