import { Component, OnInit, ViewChild, ElementRef, VERSION } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ViewVersion } from './version';
import { Version as SrvVersion } from '../../core/protocol/version';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
})
export class VersionComponent implements OnInit {
  version = VERSION;
  view = ViewVersion();
  srvVersion: SrvVersion = null;
  constructor(private httpClient: HttpClient,
    private title: Title,
  ) {
  }

  ngOnInit() {
    // console.log(this.version)
    // console.log(SrvVersion)
    this.httpClient.get("/app/version").subscribe(
      (v: SrvVersion) => {
        this.srvVersion = v;
      },
      (e) => {
        console.log(e);
      }
    )
  }
  @ViewChild('title')
  private titleRef: ElementRef;
  ngAfterViewInit() {
    if (this.titleRef && this.titleRef.nativeElement && this.titleRef.nativeElement.innerText) {
      this.title.setTitle(this.titleRef.nativeElement.innerText)
    }
  }

}
