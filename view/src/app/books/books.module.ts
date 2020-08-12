import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksRoutingModule } from './books-routing.module';

import { SharedModule } from '../shared/shared.module';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BooksComponent } from './books/books.component';
import { NewComponent } from './dialog/new/new.component';
import { RenameComponent } from './dialog/rename/rename.component';
import { ChangeIdComponent } from './dialog/change-id/change-id.component';
import { RemoveComponent } from './dialog/remove/remove.component';


@NgModule({
  declarations: [BooksComponent, NewComponent, RenameComponent, ChangeIdComponent, RemoveComponent],
  imports: [
    CommonModule, FormsModule,
    SharedModule,
    MatProgressBarModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatListModule, MatIconModule,
    MatTooltipModule,

    BooksRoutingModule
  ],
  entryComponents: [NewComponent, RenameComponent, ChangeIdComponent,
    RemoveComponent,
  ],
})
export class BooksModule { }
