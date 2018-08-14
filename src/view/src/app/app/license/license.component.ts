import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from "@angular/platform-browser";
@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css']
})
export class LicenseComponent implements OnInit, OnDestroy {
  readonly Nil = 0;
  readonly Error = 1;
  readonly Success = 2;
  status: number = this.Nil;
  text: string = "";
  error = null;
  private timer = null;
  constructor(private title: Title, private http: HttpClient) { }
  @ViewChild('title')
  private titleRef: ElementRef;
  ngAfterViewInit() {
    if (this.titleRef && this.titleRef.nativeElement && this.titleRef.nativeElement.innerText) {
      this.title.setTitle(this.titleRef.nativeElement.innerText)
    }
  }
  ngOnInit() {
    this.request();
  }
  ngOnDestroy() {
    this.closeTimer();
  }
  private request() {
    this.http.get("assets/license", { responseType: 'text' }).subscribe(
      (v: string) => {
        this.text = v;
        this.status = this.Success;
      },
      (e) => {
        this.error = e.message;
        this.status = this.Error;
      }
    );
  }
  onRetry() {
    this.status = this.Nil;
    this.timer = setTimeout(() => {
      this.request();
      this.closeTimer();
    }, 500);
  }
  private closeTimer() {
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
