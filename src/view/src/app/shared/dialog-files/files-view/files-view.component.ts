import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../../../core/utils';
import { ToasterService } from 'angular2-toaster';
import { MatDialog } from '@angular/material';
import { DialogSureComponent } from '../../dialog-sure/dialog-sure.component';
@Component({
  selector: 'app-files-view',
  templateUrl: './files-view.component.html',
  styleUrls: ['./files-view.component.css']
})
export class FilesViewComponent implements OnInit {
  isInit: boolean = false;
  request: boolean = false;
  error: any = null;
  items: Array<string> = null;
  constructor(private shared: SharedService,
    private httpClient: HttpClient,
    private toasterService: ToasterService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.Refresh();
  }
  Refresh() {
    if (this.isInit || this.request) {
      return;
    }
    this.items = null;
    this.error = null;
    this.request = true;
    this.httpClient.post("/Book/List", {
      ID: this.shared.book,
      Chapter: this.shared.chapter,
    }).subscribe(
      (result: Array<string>) => {
        this.isInit = true;
        this.request = false;
        this.items = result;
      },
      (e) => {
        this.request = false;
        this.error = Utils.ResolveError(e);
      }
    );
  }
  isDisabled() {
    return this.request || this.shared.disabled;
  }
  @ViewChild('msgSure')
  private msgSure: ElementRef;
  @ViewChild('msgTitle')
  private msgTitle: ElementRef;
  onRemove(name: string) {
    if (this.isDisabled()) {
      console.log("disabled,ignore remove");
      return;
    }
    const dialogRef = this.dialog.open(
      DialogSureComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          title: this.msgTitle.nativeElement.innerText,
          text: this.msgSure.nativeElement.innerText,
        }
      },
    )
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doRemove(name);
      }
    });
  }
  private doRemove(name: string) {
    if (this.isDisabled()) {
      console.log("disabled,ignore remove");
      return;
    }

    this.request = true;
    this.httpClient.post("/Book/RemoveAssets",
      {
        ID: this.shared.book,
        Chapter: this.shared.chapter,
        Val: name,
      }
    ).subscribe(
      () => {
        this.request = false;
        for (let i = 0; i < this.items.length; i++) {
          if (name == this.items[i]) {
            this.items.splice(i, 1);
            break;
          }
        }
        this.toasterService.pop('success', '', 'Success');
      },
      (e) => {
        this.request = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      });
  }
}
