import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SharedModule } from './shared/shared.module';
import { MarkdownModule } from './markdown/markdown.module';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AboutComponent } from './app/about/about.component';
import { LicenseComponent } from './app/license/license.component';
import { ViewComponent } from './app/view/view.component';
import { EditComponent } from './app/edit/edit.component';

import { ToasterModule, ToasterService } from 'angular2-toaster';
import { SortablejsModule } from 'angular-sortablejs';
import { BooksComponent } from './app/books/books.component';
import { ValidatorsBookFindDirective } from './shared/validators/validators-book-find.directive';
import { BookDialogNewComponent } from './app/books/book-dialog-new/book-dialog-new.component';
import { BookDialogRenameComponent } from './app/books/book-dialog-rename/book-dialog-rename.component';
import { BookDialogReidComponent } from './app/books/book-dialog-reid/book-dialog-reid.component';
import { NotFoundComponent } from './app/not-found/not-found.component';
import { GitComponent } from './app/git/git.component';
import { ValidatorGitMessageDirective } from './app/git/validator-git-message.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CachedComponent } from './app/cached/cached.component';
import { VersionComponent } from './app/version/version.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LicenseComponent,
    ViewComponent,
    EditComponent,
    BooksComponent,
    ValidatorsBookFindDirective,

    BookDialogNewComponent, BookDialogRenameComponent,
    BookDialogReidComponent, NotFoundComponent, GitComponent,
    ValidatorGitMessageDirective, CachedComponent, VersionComponent
  ],
  imports: [
    BrowserModule, RouterModule, BrowserAnimationsModule,
    HttpClientModule, FormsModule,

    MatListModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatButtonModule,
    MatTooltipModule, MatProgressSpinnerModule, MatMenuModule, MatFormFieldModule,
    MatInputModule, MatProgressBarModule, MatSelectModule, MatExpansionModule,
    MatSlideToggleModule,

    ToasterModule.forRoot(),
    SortablejsModule.forRoot({ animation: 150 }),

    SharedModule, MarkdownModule,

    AppRoutingModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    BookDialogNewComponent, BookDialogRenameComponent, BookDialogReidComponent
  ],
  providers: [ToasterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
