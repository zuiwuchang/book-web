import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Utils } from '../../utils';
import { HighlightJsService } from 'angular2-highlight-js';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css']
})
export class MarkdownComponent implements OnInit {
  private update: boolean = false;
  html: SafeHtml = null;
  constructor(private domSanitizer: DomSanitizer,
    private highlightJsService: HighlightJsService
  ) { }
  @Input()
  set val(markdown: string) {
    this.html = this.domSanitizer.bypassSecurityTrustHtml(Utils.MakeHtml(markdown));
    this.update = true;
  }
  ngOnInit() {
  }
  @ViewChild("view")
  private elementRef: ElementRef
  ngAfterViewChecked(yes) {
    if (!this.update) {
      return;
    }
    this.update = false;
    const arrs = this.elementRef.nativeElement.querySelectorAll('code');
    if (arrs && arrs.length != 0) {
      for (let i = 0; i < arrs.length; i++) {
        this.highlightJsService.highlight(arrs[i]);
      }
    }
  }
}
