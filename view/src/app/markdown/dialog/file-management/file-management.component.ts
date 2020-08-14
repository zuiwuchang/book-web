import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpenedBook } from 'src/app/core/settings/settings.service';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster';
import { MatDialog } from '@angular/material/dialog';
import { requireDynamic } from 'src/app/core/core/utils';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { ServerAPI } from 'src/app/core/core/api';
import { RemoveFileComponent } from '../remove-file/remove-file.component';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private readonly dialogRef: MatDialogRef<FileManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: OpenedBook,
    private readonly httpClient: HttpClient,
    private readonly toasterService: ToasterService,
    private readonly matDialog: MatDialog,
    private readonly i18nService: I18nService,
  ) { }
  disabled = false
  items: Array<string> = null
  private clipboard: any = null
  ngOnInit(): void {
    this.Refresh()
  }
  ngOnDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy()
    }
  }
  onCancel() {
    this.dialogRef.close()
  }
  @ViewChild("btnClipboard")
  private btnClipboard: ElementRef
  ngAfterViewInit() {
    requireDynamic('clipboard').then((ClipboardJS) => {
      this.clipboard = new ClipboardJS(this.btnClipboard.nativeElement).on('success', () => {
        this.toasterService.pop('success', '', this.i18nService.get("data copied"))
      }).on('error', (evt: any) => {
        console.error('Action:', evt.action)
        console.error('Trigger:', evt.trigger)
      })
    })
  }
  Refresh() {
    if (this.disabled) {
      return
    }
    this.items = null
    this.disabled = true
    ServerAPI.v1.assets.get<Array<string>>(this.httpClient, {
      params: {
        book: this.data.book,
        chapter: this.data.chapter,
      },
    }).then((result) => {
      this.disabled = false
      this.items = result
      console.log(result)
    }, (e) => {
      this.toasterService.pop('error', undefined, e)
    }).finally(() => {
      this.disabled = false
    })
  }
  onRemove(name: string) {
    if (this.disabled) {
      console.log("disabled,ignore remove")
      return
    }
    this.matDialog.open(RemoveFileComponent, {
      width: '80%',
      maxWidth: 800,
      data: name,
    }).afterClosed().toPromise<boolean>().then((ok) => {
      if (!ok) {
        return
      }

      this.disabled = true
      ServerAPI.v1.assets.delete(this.httpClient, {
        params: {
          book: this.data.book,
          chapter: this.data.chapter,
          filename: name,
        }
      }).then(() => {
        this.toasterService.pop('success', undefined, this.i18nService.get('File deleted'))
        const index = this.items.indexOf(name)
        if (index != -1) {
          this.items.splice(index, 1)
        }
      }, (e) => {
        this.toasterService.pop('error', undefined, e)
      }).finally(() => {
        this.disabled = false
      })
    })
  }
  onCopy(name: string) {
    this.btnClipboard.nativeElement.setAttribute("data-clipboard-text", "assets/" + name)
    this.btnClipboard.nativeElement.click()
  }
  onRename(name: string) {
    //   if (this.isDisabled()) {
    //     console.log("disabled,ignore rename");
    //     return;
    //   }
    //   const dialogRef = this.dialog.open(
    //     FileRenameComponent,
    //     {
    //       width: '80%',
    //       maxWidth: 800,
    //       data: {
    //         val: name,
    //       }
    //     },
    //   )
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this.doRename(name, result);
    //     }
    //   });
    // }
    // doRename(name, newname) {
    //   if (this.isDisabled()) {
    //     console.log("disabled,ignore rename");
    //     return;
    //   } else if (name == newname) {
    //     return;
    //   }

    //   this.request = true;
    //   this.httpClient.post("/Book/RenameAssets",
    //     {
    //       ID: this.shared.book,
    //       Chapter: this.shared.chapter,
    //       Name: name,
    //       Newname: newname
    //     }
    //   ).subscribe(
    //     () => {
    //       this.request = false;
    //       for (let i = 0; i < this.items.length; i++) {
    //         if (name == this.items[i]) {
    //           this.items[i] = newname;
    //         } else if (newname == this.items[i]) {
    //           this.items.splice(i, 1);
    //         }
    //       }
    //       this.toasterService.pop('success', '', 'Success');
    //     },
    //     (e) => {
    //       this.request = false;
    //       this.toasterService.pop('error', '', Utils.ResolveError(e));
    //     });
  }
}
