import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { ToasterModule, ToasterService } from 'angular2-toaster';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { SortablejsModule } from 'ngx-sortablejs';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


import { SharedModule } from './shared/shared.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    ToasterModule.forRoot(),
    SortablejsModule.forRoot({ animation: 150 }),
    HighlightJsModule,
    MatIconModule, MatTooltipModule,
    SharedModule,

    AppRoutingModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ToasterService, HighlightJsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
