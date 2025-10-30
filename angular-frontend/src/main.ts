// path: src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),

    // Enables Angular animations globally
    provideAnimations(),

    // 👇 Add router scroll restoration & anchor scrolling
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // scrolls to top when navigating to new route
        anchorScrolling: 'enabled',           // supports #anchors
      })
    ),
  ],
}).catch(err => console.error(err));
