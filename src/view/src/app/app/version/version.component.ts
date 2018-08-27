import { Component, OnInit, VERSION } from '@angular/core';
import { Version as viewVersion } from '../version';
import { Version as SrvVersion } from '../../core/protocol/version';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
})
export class VersionComponent implements OnInit {
  version = VERSION;
  view = viewVersion();
  srvVersion: SrvVersion = null;
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  console.log( this.version)
    this.httpClient.get("/app/version").subscribe(
      (v: SrvVersion) => {
        this.srvVersion = v;
      },
      (e) => {
        console.log(e);
      }
    )
  }
}
