import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from '../markdown/markdown.module';

import { ViewRoutingModule } from './view-routing.module';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    MarkdownModule,
    ViewRoutingModule
  ]
})
export class ViewModule { }
