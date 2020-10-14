import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shared-ads-auto',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.scss']
})
export class AutoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  private ads_: string
  ok = false
  @Input()
  set ads(v: string) {
    if (v) {
      v = v.trim()
      this.ads_ = v
      this.ok = true
    }
  }
  get ads(): string {
    return this.ads_
  }

}
