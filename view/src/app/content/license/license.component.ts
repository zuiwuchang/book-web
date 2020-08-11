import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ServerAPI } from '../../core/core/api';
import { resolveError } from 'src/app/core/core/restful';
import { ToasterService } from 'angular2-toaster';
import { Title } from '@angular/platform-browser';
import { I18nService } from 'src/app/core/i18n/i18n.service';
@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  constructor(public readonly httpClient: HttpClient,
    private toasterService: ToasterService,
    private readonly i18nService: I18nService,
    private readonly title: Title,
  ) { }
  content = ''
  ngOnInit(): void {
    this.title.setTitle(this.i18nService.get('License'))

    this.httpClient.get(ServerAPI.static.license, {
      responseType: 'text',
    }).subscribe((text) => {
      this.content = text
    }, (e) => {

      this.toasterService.pop('error',
        undefined,
        resolveError(e),
      )
    })
  }
}
