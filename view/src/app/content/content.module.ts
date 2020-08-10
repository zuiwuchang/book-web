import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { LicenseComponent } from './license/license.component';
import { AboutComponent } from './about/about.component';

import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [LicenseComponent, AboutComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    ContentRoutingModule
  ]
})
export class ContentModule { }
