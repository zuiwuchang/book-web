import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { LicenseComponent } from './license/license.component';
import { AboutComponent } from './about/about.component';
import { VersionComponent } from './version/version.component';


@NgModule({
  declarations: [LicenseComponent, AboutComponent, VersionComponent],
  imports: [
    CommonModule,
    MatButtonModule, MatCardModule, MatListModule,
    MatIconModule,
    ContentRoutingModule
  ]
})
export class ContentModule { }
