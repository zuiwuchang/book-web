import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, } from '@angular/core';
import { CacheService, CacheItem } from '../../core/cache/cache.service';
import { Cache } from '../../core/cache/cache';
import { ToasterService } from 'angular2-toaster';
import { Xi18n } from '../../core/xi18n';
const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;
@Component({
  selector: 'app-cached',
  templateUrl: './cached.component.html',
  styleUrls: ['./cached.component.css']
})
export class CachedComponent implements OnInit {
  isSupported: boolean = true;
  cache: Cache = new Cache();
  xi18n: Xi18n = new Xi18n();
  key: string = "";
  search: boolean = false;
  items: Array<CacheItem> = null;
  constructor(private cacheService: CacheService,
    private toasterService: ToasterService,
  ) {
    if (!window.indexedDB) {
      this.isSupported = false;
    }
  }

  ngOnInit() {
    this.cache.enable = this.cacheService.cache.enable;
    this.cache.capacity = this.cacheService.cache.capacity;
  }
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  ngAfterViewInit() {
    this.xi18n.init(this.xi18nRef.nativeElement);
  }
  onSave() {
    let capacity: any = this.cache.capacity;
    capacity = parseInt(capacity);
    if (isNaN(capacity) || capacity < 1) {
      capacity = 200;
    }
    this.cache.capacity = capacity;
    this.cacheService.save(this.cache);
    this.toasterService.pop('success', '', this.xi18n.get("save.success"));
  }
  onSearch() {
    if (this.search) {
      console.log("wait result,ignore search");
      return;
    }
    let key = this.key;
    let match: RegExp = null;
    if (key == undefined || key == null) {

    } else {
      key = key.trim();
      match = new RegExp(key);
    }

    this.search = true;
    this.cacheService.getCaches(match).then(
      (arrs: Array<CacheItem>) => {
        this.search = false;
        this.items = arrs;
      },
      (e) => {
        this.search = false;
        this.toasterService.pop('error', "", e);
      }
    )
  }
  getSize(n: number): string {
    if (n > GB) {
      return (n / GB).toFixed(2) + " gb";
    } else if (n > MB) {
      return (n / MB).toFixed(2) + " mb";
    } else if (n > KB) {
      return (n / KB).toFixed(2) + " kb";
    }
    return n + " b";
  }
}
