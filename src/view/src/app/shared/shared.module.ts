import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownViewComponent } from './markdown/markdown-view/markdown-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,MatProgressBarModule
  ],
  declarations: [MarkdownViewComponent],
  exports:[
    MarkdownViewComponent,
  ]
})
export class SharedModule { }
