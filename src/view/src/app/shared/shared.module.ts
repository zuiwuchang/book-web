import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarkdownViewComponent } from './markdown/markdown-view/markdown-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MarkdownBarComponent } from './markdown/markdown-bar/markdown-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';

import { MarkdownComponent } from './markdown/markdown/markdown.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoginComponent } from './login/login.component';

import { ShowDirective } from './show.directive';
import { HideDirective } from './hide.directive';
import { MarkdownEditComponent } from './markdown/markdown-edit/markdown-edit.component';
@NgModule({
  imports: [
    CommonModule, RouterModule,FormsModule,

    HighlightJsModule,

    MatButtonModule, MatProgressBarModule, MatSidenavModule, MatIconModule,
    MatToolbarModule, MatListModule, MatMenuModule, MatDialogModule, MatTooltipModule,
    MatFormFieldModule,MatSlideToggleModule,MatInputModule
  ],
  providers: [HighlightJsService],
  declarations: [MarkdownViewComponent, MarkdownComponent,
    MarkdownBarComponent, NavigationBarComponent, LoginComponent,

    ShowDirective,HideDirective, MarkdownEditComponent
  ],
  exports: [
    MarkdownViewComponent, NavigationBarComponent,MarkdownEditComponent
  ],
  entryComponents: [
    LoginComponent
  ]
})
export class SharedModule { }
