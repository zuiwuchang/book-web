import { Component, OnInit, Input } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'markdown-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  constructor(private readonly locationStrategy: LocationStrategy,
  ) {
  }
  prepareExternalUrl(url: string) {
    return this.locationStrategy.prepareExternalUrl(url)
  }
  ngOnInit(): void {
  }
  @Input()
  title: string
  @Input()
  ads: boolean
  @Input()
  previous: boolean
  @Input()
  previousName: string
  @Input()
  previousUrl: string
  @Input()
  next: boolean
  @Input()
  nextName: string
  @Input()
  nextUrl: string

}
