import { Component, OnInit } from '@angular/core';
import { Book } from '../../core/protocol';
import { Title } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { ServerAPI } from 'src/app/core/core/api';
import { NewComponent, DialogData } from '../dialog/new/new.component';
import { RenameComponent } from '../dialog/rename/rename.component';
import { isString } from 'king-node/dist/core';
import { ChangeIdComponent } from '../dialog/change-id/change-id.component';
import { RemoveComponent } from '../dialog/remove/remove.component';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  bookID = ''
  bookName = ''
  items: Array<Book> = null
  disabled: boolean
  constructor(
    private readonly title: Title,
    private readonly i18nService: I18nService,
    private readonly toasterService: ToasterService,
    private readonly httpClient: HttpClient,
    private readonly matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.title.setTitle(this.i18nService.get('Books Management'))
  }
  onSubmit() {
    if (this.disabled) {
      return
    }
    this.disabled = true

    this.items = null
    ServerAPI.v1.books.get<Array<Book>>(this.httpClient, {
      params: {
        id: this.bookID,
        name: this.bookName,
      },
    }).then((items) => {
      this.items = items
    }, (e) => {
      this.toasterService.pop('error', undefined, e)
    }).finally(() => {
      this.disabled = false
    })
  }
  onClickNew() {
    if (this.disabled) {
      return
    }
    this.matDialog.open(NewComponent, {
      width: '80%',
      maxWidth: 800,
      data: {
        id: "",
        name: "",
      },
    }).afterClosed().subscribe((result: DialogData) => {
      if (result && !this.disabled) {
        this._new(result.id, result.name)
      }
    })
  }
  private _new(id: string, name: string) {
    this.disabled = true
    ServerAPI.v1.books.post(this.httpClient, {
      id: id,
      name: name,
    }).then(() => {
      const book: Book = {
        id: id,
        name: name,
      }
      if (this.items) {
        this.items.push(book)
      } else {
        this.items = [book]
      }
    }, (e) => {
      this.toasterService.pop('error', undefined, e)
    }).finally(() => {
      this.disabled = false
    })
  }
  onClickRename(book: Book) {
    if (this.disabled) {
      return
    }
    this.matDialog.open(RenameComponent, {
      width: '80%',
      maxWidth: 800,
      data: {
        val: book.name,
      },
    }).afterClosed().subscribe((result: string) => {
      if (!this.disabled && isString(result) && result != book.name) {
        this._rename(book, result)
      }
    })
  }
  private _rename(book: Book, name: string) {
    this.disabled = true
    ServerAPI.v1.books.patch(this.httpClient, 'name', {
      id: book.id,
      name: name,
    }).then(() => {
      book.name = name
    }, (e) => {
      this.toasterService.pop('error', undefined, e)
    }).finally(() => {
      this.disabled = false
    })
  }
  onClickChangeID(book: Book) {
    if (this.disabled) {
      return
    }
    this.matDialog.open(ChangeIdComponent, {
      width: '80%',
      maxWidth: 800,
      data: {
        val: book.id,
      },
    }).afterClosed().subscribe((result: string) => {
      if (!this.disabled && isString(result) && result != book.id) {
        this._changeID(book, result)
      }
    })
  }
  private _changeID(book: Book, target: string) {
    this.disabled = true
    ServerAPI.v1.books.patch(this.httpClient, 'id', {
      id: book.id,
      target: target,
    }).then(() => {
      book.id = target
    }, (e) => {
      this.toasterService.pop('error', undefined, e)
    }).finally(() => {
      this.disabled = false
    })
  }
  onClickRemove(book: Book) {
    if (this.disabled) {
      return
    }
    this.matDialog.open(RemoveComponent, {
      width: '80%',
      maxWidth: 800,
      data: book,
    }).afterClosed().subscribe((result: boolean) => {
      if (!this.disabled && result) {
        this._remove(book.id)
      }
    })
  }
  private _remove(id: string) {
    this.disabled = true
    // ServerAPI.v1.books.delete(this.httpClient).then(() => {

    // }, (e) => {
    //   this.toasterService.pop('error', undefined, e)
    // }).finally(() => {
    //   this.disabled = false
    // })
  }
}
