import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { ToasterModule, ToasterService } from 'angular2-toaster';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


import { SharedModule } from './shared/shared.module';
import { EditComponent } from './app/edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    ToasterModule.forRoot(),
    HighlightJsModule,
    MatIconModule, MatTooltipModule,
    SharedModule,

    AppRoutingModule
  ],
  providers: [ToasterService, HighlightJsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
