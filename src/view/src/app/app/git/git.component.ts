import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { Utils } from '../../core/utils';
@Component({
  selector: 'app-git',
  templateUrl: './git.component.html',
  styleUrls: ['./git.component.css']
})
export class GitComponent implements OnInit {
  cmd: string = 'add';
  extend: string = '';
  request: boolean = false;
  val: string = null;
  constructor(private httpClient: HttpClient,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
  }
  onSubmit() {
    if (this.request) {
      console.log("wiat result,ignore submit")
      return;
    }
    switch (this.cmd) {
      case "add":
        this.doGit(this.cmd);
        break;
      case "status":
        this.doGit(this.cmd);
        break;
      case "commit":
        this.doGit(this.cmd, this.extend);
        break;

      case "push":
        this.doGit(this.cmd);
        break;
      case "pull":
        this.doGit(this.cmd);
        break;

      case "log":
        this.doGit(this.cmd);
        break;
    }
  }
  private doGit(cmd: string, extend?: string) {
    this.request = true;
    this.val = null;
    this.httpClient.post("/git/command", {
      Command: cmd,
      Extend: extend
    }).subscribe(
      (result: string) => {
        this.request = false;
        if(result != ""){
          this.val = result;
        }
      },
      (e) => {
        this.request = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      },
    );
  }
}
