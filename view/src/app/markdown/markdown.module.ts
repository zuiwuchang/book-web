import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SortablejsModule } from 'ngx-sortablejs';

import { SharedModule } from '../shared/shared.module';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ViewComponent } from './view/view.component';
import { MarkdownViewComponent } from './markdown-view/markdown-view.component';
import { BarComponent } from './bar/bar.component';
import { EditComponent } from './edit/edit.component';
import { MarkdownEditComponent } from './markdown-edit/markdown-edit.component';
import { NewChapterComponent } from './dialog/new-chapter/new-chapter.component';
import { EditChapterComponent } from './dialog/edit-chapter/edit-chapter.component';


@NgModule({
  declarations: [ViewComponent, MarkdownViewComponent, BarComponent, EditComponent, MarkdownEditComponent, NewChapterComponent, EditChapterComponent],
  imports: [
    CommonModule, FormsModule, RouterModule,
    SortablejsModule,
    SharedModule,
    MatProgressBarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
  ],
  exports: [
    ViewComponent, EditComponent,
  ],
  entryComponents: [
    NewChapterComponent,EditChapterComponent,
  ]
})
export class MarkdownModule { }
