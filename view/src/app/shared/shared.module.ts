import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [NavigationBarComponent],
  imports: [
    CommonModule, RouterModule,
    MatToolbarModule, MatTooltipModule, MatIconModule,
    MatMenuModule, MatButtonModule,
  ],
  exports: [NavigationBarComponent],
})
export class SharedModule { }
