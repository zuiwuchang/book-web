import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';


import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';

import { MarkdownViewComponent } from './markdown-view/markdown-view.component';
import { MarkdownBarComponent } from './markdown-bar/markdown-bar.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { MarkdownEditComponent } from './markdown-edit/markdown-edit.component';
@NgModule({
  imports: [
    CommonModule,FormsModule,RouterModule,

    MatButtonModule, MatProgressBarModule, MatSidenavModule, MatIconModule,
    MatToolbarModule, MatListModule, MatMenuModule, MatDialogModule, MatTooltipModule,
    MatFormFieldModule,MatSlideToggleModule,MatInputModule,

    HighlightJsModule
  ],
  providers: [HighlightJsService],
  declarations: [
    MarkdownViewComponent, MarkdownComponent, MarkdownBarComponent,
    MarkdownEditComponent,
  ],
  exports:[
    MarkdownViewComponent,MarkdownEditComponent
  ]
})
export class MarkdownModule { }
