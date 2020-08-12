import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';

import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoginComponent } from './login/login.component';
import { ValidatorIdDirective } from './validators/validator-id.directive';

@NgModule({
  declarations: [NavigationBarComponent, LoginComponent, ValidatorIdDirective],
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatToolbarModule, MatTooltipModule, MatIconModule,
    MatMenuModule, MatButtonModule, MatProgressSpinnerModule,
    MatDialogModule, MatProgressBarModule, MatFormFieldModule,
    MatSlideToggleModule, MatInputModule,
  ],
  exports: [NavigationBarComponent, ValidatorIdDirective],
  entryComponents: [LoginComponent],
})
export class SharedModule { }
