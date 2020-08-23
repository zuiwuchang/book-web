import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdsenseModule } from 'ng2-adsense';

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
import { ValidatorBookFindDirective } from './validators/validator-book-find.directive';
import { AdsComponent } from './ads/ads/ads.component';

@NgModule({
  declarations: [NavigationBarComponent, LoginComponent, ValidatorIdDirective, ValidatorBookFindDirective, AdsComponent],
  imports: [
    CommonModule, RouterModule, FormsModule,
    AdsenseModule.forRoot(),
    MatToolbarModule, MatTooltipModule, MatIconModule,
    MatMenuModule, MatButtonModule, MatProgressSpinnerModule,
    MatDialogModule, MatProgressBarModule, MatFormFieldModule,
    MatSlideToggleModule, MatInputModule,
  ],
  exports: [NavigationBarComponent, ValidatorIdDirective, ValidatorBookFindDirective,
    AdsComponent,
  ],
  entryComponents: [LoginComponent],
})
export class SharedModule { }
