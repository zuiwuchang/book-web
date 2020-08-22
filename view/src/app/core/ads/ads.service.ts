import { Injectable } from '@angular/core';
import { Completer } from 'king-node/dist/async/completer';
import { isString } from 'king-node/dist/core';
import { requireDynamic } from '../core/utils';
@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private ready_ = new Completer<string>()
  constructor() { }
  load() {
    this.ready_.promise.then((id) => {
      if (isString(id) && id != '') {
        this._load(id)
      }
    })
  }
  get ready(): Promise<string> {
    return this.ready_.promise
  }
  resolve(id: string) {
    this.ready_.resolve(id)
  }
  private busy_ = false
  private _load(id: string) {
    if (this.busy_) {
      return
    }
    this.busy_ = true
    loadJS('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', id).then(() => {
      console.log("load ads ok")
    }, (e) => {
      console.log("load ads error :", e)
      this.busy_ = false
    })
  }
}
function loadJS(url: string, id: string): Promise<HTMLElement> {
  return new Promise<HTMLElement>(function (resolve, reject) {
    const script: any = document.createElement('script')
    script.type = 'text/javascript'
    if (script.setAttribute) {
      script.setAttribute('data-ad-client', id)
    } else {
      reject('setAttribute not supported')
      return
    }

    if (script.readyState) {//IE
      script.onreadystatechange = function () {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null
          resolve(script)
        }
      }
    } else {
      script.onload = function () {
        resolve(script)
      }
    }
    script.src = url
    document.getElementsByTagName('head')[0].appendChild(script)
  })


}
