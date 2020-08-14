import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from '../markdown/markdown.module';

import { EditRoutingModule } from './edit-routing.module';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [EditComponent],
  imports: [
    CommonModule,
    MarkdownModule,
    EditRoutingModule
  ]
})
export class EditModule { }
