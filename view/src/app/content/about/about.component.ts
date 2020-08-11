import { Component, OnInit, } from '@angular/core';
import { ServerAPI } from 'src/app/core/core/api';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { resolveError } from 'src/app/core/core/restful';
import { Title } from "@angular/platform-browser";
import { I18nService } from 'src/app/core/i18n/i18n.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  content: string
  constructor(
    private readonly httpClient: HttpClient,
    private readonly toasterService: ToasterService,
    private readonly i18nService: I18nService,
    private readonly title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle(this.i18nService.get('About'))

    this.httpClient.get(ServerAPI.static.licenses, {
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
