import { Component, OnInit } from '@angular/core';
import { ServerAPI } from 'src/app/core/core/api';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { resolveError } from 'src/app/core/core/restful';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  content: string
  constructor(
    private httpClient: HttpClient,
    private toasterService: ToasterService,
  ) { }

  ngOnInit(): void {
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
