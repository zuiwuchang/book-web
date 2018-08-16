import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

import { SharedModule } from './shared/shared.module';
import { MarkdownModule } from './markdown/markdown.module';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AboutComponent } from './app/about/about.component';
import { LicenseComponent } from './app/license/license.component';
import { ViewComponent } from './app/view/view.component';
import { EditComponent } from './app/edit/edit.component';



@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LicenseComponent,
    ViewComponent,
    EditComponent
  ],
  imports: [
    BrowserModule, RouterModule,
    BrowserAnimationsModule, HttpClientModule,

    MatListModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatButtonModule,
    MatTooltipModule, MatProgressSpinnerModule,MatMenuModule,


    SharedModule,MarkdownModule,
    
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
