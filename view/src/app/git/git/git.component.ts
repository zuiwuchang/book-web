import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { I18nService } from 'src/app/core/i18n/i18n.service';
@Component({
  selector: 'app-git',
  templateUrl: './git.component.html',
  styleUrls: ['./git.component.scss']
})
export class GitComponent implements OnInit {

  constructor(
    private readonly i18nService: I18nService,
    private readonly title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle(this.i18nService.get('Git Command'))
  }

}
