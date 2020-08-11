import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { ServerAPI } from 'src/app/core/core/api';
@Component({
  selector: 'app-git',
  templateUrl: './git.component.html',
  styleUrls: ['./git.component.scss']
})
export class GitComponent implements OnInit {
  cmd = 'add'
  extend = ''
  disabled = false
  val: string = null
  constructor(private httpClient: HttpClient,
    private toasterService: ToasterService,
    private readonly i18nService: I18nService,
    private readonly title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle(this.i18nService.get('Git Command'))
  }
  onSubmit() {
    if (this.disabled) {
      console.log("wiat disabled,ignore submit")
      return;
    }
    this.val = null
    this.disabled = true
    ServerAPI.v1.git.post<string>(this.httpClient, {
      command: this.cmd,
      extend: this.extend,
    }).then((data) => {
      this.val = data
    }, (e) => {
      this.toasterService.pop('error', undefined, e)
    }).finally(() => {
      this.disabled = false
    })
  }
}
