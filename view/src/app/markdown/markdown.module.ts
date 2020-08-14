import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ViewComponent } from './view/view.component';
import { MarkdownViewComponent } from './markdown-view/markdown-view.component';
import { BarComponent } from './bar/bar.component';
import { EditComponent } from './edit/edit.component';
import { MarkdownEditComponent } from './markdown-edit/markdown-edit.component';

@NgModule({
  declarations: [ViewComponent, MarkdownViewComponent, BarComponent, EditComponent, MarkdownEditComponent],
  imports: [
    CommonModule, RouterModule,
    MatProgressBarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule,
  ],
  exports: [
    ViewComponent, EditComponent,
  ]
})
export class MarkdownModule { }
