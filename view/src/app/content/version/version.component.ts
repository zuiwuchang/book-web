import { Component, OnInit, VERSION } from '@angular/core';
import { ServerAPI } from 'src/app/core/core/api';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
interface Version {
  platform: string
  tag: string
  commit: string
  date: string
}
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {

  VERSION = VERSION
  version: Version
  constructor(private httpClient: HttpClient,
    private toasterService: ToasterService,
  ) { }

  ngOnInit(): void {
    ServerAPI.v1.version.get<Version>(this.httpClient).then((data) => {
      this.version = data
    }, (e) => {
      this.toasterService.pop('error',
        undefined,
        e,
      )
    })
  }

}
