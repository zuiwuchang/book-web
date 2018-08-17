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
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

import { FileUploadModule } from 'ng2-file-upload';

import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoginComponent } from './login/login.component';
import { ShowDirective } from './show.directive';
import { HideDirective } from './hide.directive';
import { DialogErrorComponent } from './dialog-error/dialog-error.component';
import { DialogFilesComponent } from './dialog-files/dialog-files.component';
import { FilesViewComponent } from './dialog-files/files-view/files-view.component';
import { DialogSureComponent } from './dialog-sure/dialog-sure.component';
import { FileRenameComponent } from './dialog-files/file-rename/file-rename.component';
import { ValidatorsFileNameDirective } from './validators/validators-file-name.directive';
import { FilesUploadComponent } from './dialog-files/files-upload/files-upload.component';
import { DialogChapterComponent } from './dialog-chapter/dialog-chapter.component';
import { ValidatorsIdDirective } from './validators/validators-id.directive';

@NgModule({
  imports: [
    CommonModule, RouterModule, FormsModule,

    MatButtonModule, MatProgressBarModule, MatSidenavModule, MatIconModule,
    MatToolbarModule, MatListModule, MatMenuModule, MatDialogModule, MatTooltipModule,
    MatFormFieldModule, MatSlideToggleModule, MatInputModule, MatTabsModule,
    MatCardModule,

    FileUploadModule,
  ],
  providers: [],
  declarations: [
    NavigationBarComponent, LoginComponent,

    ShowDirective, HideDirective,

    ValidatorsFileNameDirective,

    DialogErrorComponent, DialogFilesComponent, FilesViewComponent, DialogSureComponent,
    FileRenameComponent,FilesUploadComponent,
    DialogChapterComponent,
    ValidatorsIdDirective
  ],
  exports: [
    NavigationBarComponent, ShowDirective, HideDirective,

    ValidatorsFileNameDirective,
    DialogErrorComponent, DialogFilesComponent, DialogSureComponent,
    DialogChapterComponent
  ],
  entryComponents: [
    LoginComponent, DialogErrorComponent, DialogFilesComponent, DialogSureComponent, FileRenameComponent,
    DialogChapterComponent
  ]
})
export class SharedModule { }
