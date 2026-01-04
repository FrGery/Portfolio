import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server'; // Javítva az import
import { provideNoopAnimations } from '@angular/platform-browser/animations'; // Ezt add hozzá!
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideNoopAnimations() // Ez hatástalanítja a hibaüzenetet a build során
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
