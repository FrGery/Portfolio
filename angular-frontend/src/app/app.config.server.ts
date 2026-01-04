import {ApplicationConfig, mergeApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server'; // Javítva az import
import {provideNoopAnimations} from '@angular/platform-browser/animations'; // Ezt add hozzá!
import {appConfig} from './app.config';
import { provideClientHydration } from '@angular/platform-browser'; // Ezt add hozzá

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideNoopAnimations(),
    provideClientHydration()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
