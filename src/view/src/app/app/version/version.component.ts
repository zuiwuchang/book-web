import { Component, OnInit } from '@angular/core';
import { Version } from '../version';
import { Version as SrvVersion } from '../../core/protocol/version';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
})
export class VersionComponent implements OnInit {
  angular = Version();
  srvVersion: SrvVersion = null;
  error: any = null;
  request: boolean = false;
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.refresh();
  }
  refresh() {
    if (this.request) {
      console.log("wait result,ignore refresh");
      return;
    }
    this.request = true;
    this.httpClient.get("/app/version").subscribe(
      (v: SrvVersion) => {
        this.request = false;
        this.srvVersion = v;
      },
      (e) => {
        this.request = false;
        this.error = e;
      }
    )
  }
}
