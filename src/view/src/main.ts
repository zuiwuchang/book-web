import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

// use the require method provided by webpack
declare const require;
if (environment.production) {
  enableProdMode();
}

let options = undefined;
if (!environment.production) {
  const translations = require(`raw-loader!./locale/zh-Hant.xlf`);
  options = {
    providers: [
      { provide: TRANSLATIONS, useValue: translations },
      { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' }
    ]
  };
}

platformBrowserDynamic().bootstrapModule(AppModule, options)
  .catch(err => console.log(err));

