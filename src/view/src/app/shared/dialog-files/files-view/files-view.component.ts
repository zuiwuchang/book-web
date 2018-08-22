import { Component, OnInit,OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../../../core/utils';
import { ToasterService } from 'angular2-toaster';
import { MatDialog } from '@angular/material';
import { DialogSureComponent } from '../../dialog-sure/dialog-sure.component';
import { FileRenameComponent } from '../file-rename/file-rename.component';
import * as ClipboardJS from 'clipboard/dist/clipboard.min.js'
import { Xi18n } from '../../../core/xi18n';
@Component({
  selector: 'app-files-view',
  templateUrl: './files-view.component.html',
  styleUrls: ['./files-view.component.css']
})
export class FilesViewComponent implements OnInit,OnDestroy, AfterViewInit {
  private xi18n: Xi18n = new Xi18n();
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
  ngOnDestroy(){
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }
  private clipboard: any = null;
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  ngAfterViewInit() {
    this.xi18n.init(this.xi18nRef.nativeElement);

    this.clipboard = new ClipboardJS(this.btnClipboard.nativeElement).on('success', () => {
      this.toasterService.pop('success', '', this.xi18n.get("copied"));
    }).on('error', (evt) => {
      console.error('Action:', evt.action);
      console.error('Trigger:', evt.trigger);
    });
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
    return this.request;
  }
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
          title: this.xi18n.get("title"),
          text: this.xi18n.get("sure"),
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
  @ViewChild("btnClipboard")
  private btnClipboard: ElementRef
  onCopy(name: string) {
    this.btnClipboard.nativeElement.setAttribute("data-clipboard-text","assets/" + name);
    this.btnClipboard.nativeElement.click();
  }
  onRename(name: string) {
    if (this.isDisabled()) {
      console.log("disabled,ignore rename");
      return;
    }
    const dialogRef = this.dialog.open(
      FileRenameComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          val: name,
        }
      },
    )
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doRename(name, result);
      }
    });
  }
  doRename(name, newname) {
    if (this.isDisabled()) {
      console.log("disabled,ignore rename");
      return;
    } else if (name == newname) {
      return;
    }

    this.request = true;
    this.httpClient.post("/Book/RenameAssets",
      {
        ID: this.shared.book,
        Chapter: this.shared.chapter,
        Name: name,
        Newname: newname
      }
    ).subscribe(
      () => {
        this.request = false;
        for (let i = 0; i < this.items.length; i++) {
          if (name == this.items[i]) {
            this.items[i] = newname;
          } else if (newname == this.items[i]) {
            this.items.splice(i, 1);
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
