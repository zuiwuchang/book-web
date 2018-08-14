import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownViewComponent } from './markdown/markdown-view/markdown-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MarkdownComponent } from './markdown/markdown/markdown.component';
@NgModule({
  imports: [
    CommonModule,

    HighlightJsModule,

    MatButtonModule,MatProgressBarModule
  ],
  providers:[HighlightJsService],
  declarations: [MarkdownViewComponent, MarkdownComponent],
  exports:[
    MarkdownViewComponent,
  ]
})
export class SharedModule { }
