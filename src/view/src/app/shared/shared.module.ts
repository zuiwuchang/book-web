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

import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoginComponent } from './login/login.component';
import { ShowDirective } from './show.directive';
import { HideDirective } from './hide.directive';
import { DialogErrorComponent } from './dialog-error/dialog-error.component';

@NgModule({
  imports: [
    CommonModule, RouterModule,FormsModule,

    MatButtonModule, MatProgressBarModule, MatSidenavModule, MatIconModule,
    MatToolbarModule, MatListModule, MatMenuModule, MatDialogModule, MatTooltipModule,
    MatFormFieldModule,MatSlideToggleModule,MatInputModule,

  ],
  providers: [],
  declarations: [
    NavigationBarComponent, LoginComponent,

    ShowDirective,HideDirective, DialogErrorComponent
  ],
  exports: [
    NavigationBarComponent,ShowDirective,HideDirective,DialogErrorComponent
  ],
  entryComponents: [
    LoginComponent,DialogErrorComponent
  ]
})
export class SharedModule { }
