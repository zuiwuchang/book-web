import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarkdownViewComponent } from './markdown/markdown-view/markdown-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MarkdownComponent } from './markdown/markdown/markdown.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MarkdownBarComponent } from './markdown/markdown-bar/markdown-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
@NgModule({
  imports: [
    CommonModule, RouterModule,

    HighlightJsModule,

    MatButtonModule, MatProgressBarModule, MatSidenavModule, MatIconModule,
    MatToolbarModule, MatListModule, MatMenuModule
  ],
  providers: [HighlightJsService],
  declarations: [MarkdownViewComponent, MarkdownComponent, MarkdownBarComponent, NavigationBarComponent],
  exports: [
    MarkdownViewComponent,NavigationBarComponent,
  ]
})
export class SharedModule { }
