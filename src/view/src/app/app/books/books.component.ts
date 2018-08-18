import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Xi18n } from '../../core/xi18n';
import { Title } from "@angular/platform-browser";
import { Book } from '../../core/protocol/book';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../../core/utils';
import { MatDialog } from '@angular/material';
import { BookDialogNewComponent, DialogData } from './book-dialog-new/book-dialog-new.component';
import { DialogSureComponent } from '../../shared/dialog-sure/dialog-sure.component';
import { BookDialogRenameComponent } from './book-dialog-rename/book-dialog-rename.component';
import { BookDialogReidComponent } from './book-dialog-reid/book-dialog-reid.component';
@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, AfterViewInit {
  bookID: string;
  bookName: string;
  items: Array<Book> = null;
  request: boolean = false;
  constructor(
    private title: Title,
    private toasterService: ToasterService,
    private httpClient: HttpClient,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.onSubmit()
  }
  @ViewChild("xi18n")
  private xi18nRef: ElementRef
  private xi18n: Xi18n = new Xi18n();
  ngAfterViewInit() {
    if (!this.xi18nRef) {
      return;
    }
    this.xi18n.init(this.xi18nRef.nativeElement);
    this.title.setTitle(this.xi18n.get("title"));
  }
  onSubmit() {
    if (this.request) {
      return
    }
    this.request = true;
    this.items = null;
    if (this.bookID == undefined || this.bookID == null) {
      this.bookID = "";
    }
    if (this.bookName == undefined || this.bookName == null) {
      this.bookName = "";
    }
    this.httpClient.post("/Book/Find", {
      ID: this.bookID,
      Name: this.bookName,
    }).subscribe(
      (items: Array<Book>) => {
        this.request = false;
        this.items = items;
      },
      (e) => {
        this.request = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    );
  }
  onNew() {
    if (this.request) {
      return
    }
    const dialogRef = this.dialog.open(
      BookDialogNewComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          id: "",
          name: "",
        },
      },
    )
    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        this.doNew(result);
      }
    });
  }
  private doNew(result: DialogData) {
    if (this.request) {
      return
    }
    this.request = true;

    this.httpClient.post("/Book/New", {
      ID: result.id,
      Name: result.name,
    }).subscribe(
      () => {
        this.request = false;
        const book = new Book();
        book.ID = result.id;
        book.Name = result.name;
        if (this.items) {
          this.items.push(book);
        } else {
          this.items = [book];
        }
      },
      (e) => {
        this.request = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    );
  }
  onRename(book: Book) {
    if (this.request) {
      return
    }
    const dialogRef = this.dialog.open(
      BookDialogRenameComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          val: book.Name,
        },
      },
    )
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && book.Name != result) {
        this.doRename(book.ID, result);
      }
    });
  }
  private doRename(id: string, name: string) {
    if (this.request) {
      return
    }
    this.request = true;

    this.httpClient.post("/Book/Rename", {
      ID: id,
      Name: name,
    }).subscribe(
      () => {
        this.request = false;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].ID == id) {
            this.items[i].Name = name;
            break;
          }
        }
      },
      (e) => {
        this.request = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    );
  }
  onReid(book: Book) {
    if (this.request) {
      return
    }
    const dialogRef = this.dialog.open(
      BookDialogReidComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          val: book.ID,
        },
      },
    )
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && book.ID != result) {
        this.doReid(book.ID, result);
      }
    });
  }
  private doReid(id: string, newID: string) {
    if (this.request) {
      return
    }
    this.request = true;

    this.httpClient.post("/Book/Reid", {
      ID: id,
      NewID: newID,
    }).subscribe(
      () => {
        this.request = false;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].ID == id) {
            this.items[i].ID = newID;
            break;
          }
        }
      },
      (e) => {
        this.request = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    );
  }
  onRemove(book: Book) {
    if (this.request) {
      return
    }
    const dialogRef = this.dialog.open(
      DialogSureComponent,
      {
        width: '80%',
        maxWidth: 800,
        data: {
          title: this.xi18n.get("sure.title"),
          text: this.xi18n.get("sure.text") + " - " + book.Name,
        },
      },
    )
    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        this.doRemove(book);
      }
    });
  }
  private doRemove(book: Book) {
    if (this.request) {
      return
    }
    this.request = true;

    this.httpClient.post("/Book/Remove", {
      ID: book.ID,
    }).subscribe(
      () => {
        this.request = false;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].ID == book.ID) {
            this.items.splice(i, 1);
            break;
          }
        }
      },
      (e) => {
        this.request = false;
        this.toasterService.pop('error', '', Utils.ResolveError(e));
      }
    );
  }
}
