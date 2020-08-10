import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ToasterModule, ToasterService } from 'angular2-toaster';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


import { SharedModule } from './shared/shared.module';
import { ViewComponent } from './app/view/view.component';
import { EditComponent } from './app/edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    EditComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    ToasterModule.forRoot(),
    MatIconModule, MatTooltipModule,
    SharedModule,

    AppRoutingModule
  ],
  providers: [ToasterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
